import { apiGet, BaseBooksApiImpl } from '@apis/base_api';
import { Book } from '@models/book.model';

const SEARCH_URL = 'https://api.litres.ru/foundation/api/search';
const DETAIL_URL = 'https://api.litres.ru/foundation/api/arts';
const COVER_BASE = 'https://cv0.litres.ru';
const LITRES_BASE = 'https://www.litres.ru';

interface LitresPerson {
  full_name: string;
  role: string;
  url?: string;
}
interface LitresSearchInstance {
  id: number;
  title: string;
  subtitle?: string;
  cover_url?: string;
  url?: string;
  last_released_at?: string;
  persons?: LitresPerson[];
}
interface LitresSearchItem {
  type: string;
  instance: LitresSearchInstance;
}
interface LitresSearchResponse {
  status: number;
  payload: { data: LitresSearchItem[] };
}
interface LitresGenre {
  id: number;
  name: string;
}
interface LitresPublisher {
  id: number;
  title: string;
}
interface LitresDetailPayload {
  id: number;
  title: string;
  subtitle?: string;
  cover_url?: string;
  url?: string;
  annotation?: string;
  isbn?: string;
  date_written_at?: string;
  last_released_at?: string;
  genres?: LitresGenre[];
  publisher?: LitresPublisher;
  persons?: LitresPerson[];
}
interface LitresDetailResponse {
  status: number;
  payload: {
    data: LitresDetailPayload;
  };
}

export class LitresApi implements BaseBooksApiImpl {
  // Шаг 1: быстрый поиск — только search, без detail
  async getByQuery(query: string): Promise<Book[]> {
    try {
      const result = await apiGet<LitresSearchResponse>(SEARCH_URL, {
        q: query,
        limit: '25',
        offset: '0',
        types: 'text_book',
        show_unavailable: 'false',
      });
      return (result?.payload?.data ?? [])
        .filter(item => item.type === 'text_book' && item.instance)
        .map(item => this.mapSearchToBook(item.instance));
    } catch (error) {
      console.warn('LitresApi search error:', error);
      throw error;
    }
  }

  // Шаг 2: вызывается после выбора — обогащаем выбранную книгу
  async enrichBook(book: Book): Promise<Book> {
    try {
      const id = this.extractId(book);
      if (!id) return book;

      const detail = await apiGet<LitresDetailResponse>(`${DETAIL_URL}/${id}`);
      const d = detail?.payload?.data;
      if (!d) return book;

      const enriched = this.mapDetailToBook(d);

      // Стало:
      return enriched.title?.trim()
        ? enriched
        : { ...book, ...enriched, title: book.title, author: book.author, authors: book.authors };
    } catch {
      return book;
    }
  }

  private extractId(book: Book): string | null {
    // id зашит в coverUrl: https://cv0.litres.ru/pub/c/cover/72486682.jpg
    const match = book.coverUrl?.match(/\/(\d+)\.jpg$/);
    return match?.[1] ?? null;
  }

  private mapSearchToBook(inst: LitresSearchInstance): Book {
    const authors = (inst.persons ?? []).filter(p => p.role === 'author').map(p => p.full_name);
    const coverUrl = inst.cover_url ? `${COVER_BASE}${inst.cover_url}` : '';
    return {
      title: inst.title ?? '',
      subtitle: inst.subtitle ?? '',
      author: authors.join(', '),
      authors,
      category: '',
      categories: [],
      publisher: '',
      publishDate: (inst.last_released_at ?? '').slice(0, 4),
      totalPage: '',
      coverUrl,
      coverSmallUrl: coverUrl,
      description: '',
      previewLink: '',
      link: inst.url ? `${LITRES_BASE}${inst.url}` : '',
      isbn13: '',
      isbn10: '',
    };
  }

  private mapDetailToBook(d: LitresDetailPayload): Book {
    const authors = (d.persons ?? []).filter(p => p.role === 'author').map(p => p.full_name);
    const genres = (d.genres ?? []).map(g => g.name);
    const coverUrl = d.cover_url ? `${COVER_BASE}${d.cover_url}` : '';
    const isbn = (d.isbn ?? '').replace(/[-\s]/g, '');
    return {
      title: d.title ?? '',
      subtitle: d.subtitle ?? '',
      author: authors.join(', '),
      authors,
      category: genres[0] ?? '',
      categories: genres,
      publisher: d.publisher?.title ?? '',
      publishDate: (d.date_written_at ?? d.last_released_at ?? '').slice(0, 4),
      totalPage: '',
      coverUrl,
      coverSmallUrl: coverUrl,
      description: (d.annotation ?? '').replace(/<[^>]*>/g, '').trim(),
      link: d.url ? `${LITRES_BASE}${d.url}` : '',
      previewLink: '',
      isbn13: isbn.length === 13 ? isbn : '',
      isbn10: isbn.length === 10 ? isbn : '',
    };
  }
}
