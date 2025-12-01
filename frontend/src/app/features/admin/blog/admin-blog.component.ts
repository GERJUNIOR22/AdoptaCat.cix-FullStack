import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../../../core/services/blog.service';
import { PageResponse } from '../../../core/services/admin.service';

@Component({
    selector: 'app-admin-blog',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-blog.component.html'
})
export class AdminBlogComponent implements OnInit {
    postsResponse = signal<PageResponse<BlogPost> | null>(null);
    loading = signal(true);
    currentPage = 0;
    pageSize = 10;

    Math = Math;

    constructor(private blogService: BlogService) { }

    ngOnInit() {
        this.loadPosts();
    }

    loadPosts() {
        this.loading.set(true);
        this.blogService.getAllPostsAdmin(this.currentPage, this.pageSize).subscribe({
            next: (response) => {
                this.postsResponse.set(response);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading posts:', err);
                this.loading.set(false);
            }
        });
    }

    onPageSizeChange(event: Event) {
        this.pageSize = Number((event.target as HTMLSelectElement).value);
        this.currentPage = 0;
        this.loadPosts();
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadPosts();
        }
    }

    nextPage() {
        const response = this.postsResponse();
        if (response && this.currentPage < response.totalPages - 1) {
            this.currentPage++;
            this.loadPosts();
        }
    }

    deletePost(id: number) {
        if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            this.blogService.deletePost(id).subscribe({
                next: () => {
                    this.loadPosts();
                },
                error: (err) => console.error('Error deleting post:', err)
            });
        }
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800';
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'PUBLISHED':
                return 'Publicado';
            case 'DRAFT':
                return 'Borrador';
            case 'ARCHIVED':
                return 'Archivado';
            default:
                return status;
        }
    }

    formatDate(dateString: string): string {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES');
    }
}
