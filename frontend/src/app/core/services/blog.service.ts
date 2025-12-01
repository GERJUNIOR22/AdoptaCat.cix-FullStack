import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PageResponse } from './admin.service';

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImageUrl: string;
    author: {
        id: number;
        fullName: string;
        email: string;
    };
    category: 'ADOPTION_STORIES' | 'CAT_CARE' | 'NEWS' | 'EVENTS' | 'EDUCATION' | 'OTHER';
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    isFeatured: boolean;
    viewCount: number;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private apiUrl = `${environment.apiUrl}/blog`;

    constructor(private http: HttpClient) { }

    // Public endpoints
    getPublishedPosts(page: number = 0, size: number = 10): Observable<PageResponse<BlogPost>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<PageResponse<BlogPost>>(this.apiUrl, { params });
    }

    getPostBySlug(slug: string): Observable<BlogPost> {
        return this.http.get<BlogPost>(`${this.apiUrl}/${slug}`);
    }

    // Admin endpoints
    getAllPostsAdmin(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDirection: string = 'desc'): Observable<PageResponse<BlogPost>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection);
        return this.http.get<PageResponse<BlogPost>>(`${this.apiUrl}/admin/all`, { params });
    }

    createPost(post: Partial<BlogPost>): Observable<BlogPost> {
        console.log('BlogService: Creating post at', this.apiUrl, 'with data:', post);
        return this.http.post<BlogPost>(this.apiUrl, post).pipe(
            timeout(5000)
        );
    }

    updatePost(id: number, post: Partial<BlogPost>): Observable<BlogPost> {
        return this.http.put<BlogPost>(`${this.apiUrl}/${id}`, post);
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
