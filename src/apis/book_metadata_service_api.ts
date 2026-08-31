import { apiGet, BaseBooksApiImpl } from '@apis/base_api';
import { Book } from '@models/book.model';

// Один универсальный эндпоинт: сам определяет, похож ли запрос на ISBN
// или на название - не нужен отдельный detail-запрос, как у LitRes,
// сервис уже возвращает всё нужное одним ответом.
interface BookMetadataServiceItem {
  guid: string;
  Title?: string;
  Subtitle?: string;
  AuthorName?: string;
  Publisher?: string;
  PublishedYear?: number | string;
  ISBN?: string;
  ISBN13?: string;
  CoverUrl?: string;
  Genre?: string;
  Description?: string;
}

export class BookMetadataServiceApi implements BaseBooksApiImpl {
  constructor(private baseUrl: string) {
    // Без завершающего слэша, чтобы не получить двойной "//" в URL
    this.baseUrl = (baseUrl || 'https://bookmetadata.ru').replace(/\/+$/, '');
  }

  async getByQuery(query: string): Promise<Book[]> {
    try {
      const results = await apiGet<BookMetadataServiceItem[]>(`${this.baseUrl}/api/v1/search`, {
        q: query,
      });
      return (results ?? []).map(item => this.mapToBook(item));
    } catch (error) {
      console.warn('BookMetadataServiceApi search error:', error);
      throw error;
    }
  }

  private mapToBook(item: BookMetadataServiceItem): Book {
    const authors = (item.AuthorName ?? '')
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);
    const categories = (item.Genre ?? '')
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    const isbn = (item.ISBN ?? '').replace(/[-\s]/g, '');
    const isbn13Field = (item.ISBN13 ?? '').replace(/[-\s]/g, '');
    const isbn13 = isbn13Field || (isbn.length === 13 ? isbn : '');
    const isbn10 = isbn.length === 10 ? isbn : '';

    return {
      title: item.Title ?? '',
      subtitle: item.Subtitle ?? '',
      author: authors.join(', '),
      authors,
      category: categories[0] ?? '',
      categories,
      publisher: item.Publisher ?? '',
      publishDate: item.PublishedYear ? String(item.PublishedYear) : '',
      totalPage: '',
      coverUrl: item.CoverUrl ?? '',
      coverSmallUrl: item.CoverUrl ?? '',
      description: item.Description ?? '',
      previewLink: '',
      link: '',
      isbn13,
      isbn10,
    };
  }
}
