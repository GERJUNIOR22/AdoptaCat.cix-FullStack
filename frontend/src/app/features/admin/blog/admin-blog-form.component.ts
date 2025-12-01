import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../../../core/services/blog.service';

@Component({
    selector: 'app-admin-blog-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './admin-blog-form.component.html'
})
export class AdminBlogFormComponent implements OnInit {
    postForm: FormGroup;
    isEditing = signal(false);
    loading = signal(false);
    postId: number | null = null;

    categories = [
        { value: 'ADOPTION_STORIES', label: 'Historias de Adopción' },
        { value: 'CAT_CARE', label: 'Cuidado de Gatos' },
        { value: 'NEWS', label: 'Noticias' },
        { value: 'EVENTS', label: 'Eventos' },
        { value: 'EDUCATION', label: 'Educación' },
        { value: 'OTHER', label: 'Otro' }
    ];

    statuses = [
        { value: 'DRAFT', label: 'Borrador' },
        { value: 'PUBLISHED', label: 'Publicado' },
        { value: 'ARCHIVED', label: 'Archivado' }
    ];

    constructor(
        private fb: FormBuilder,
        private blogService: BlogService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.postForm = this.fb.group({
            title: ['', [Validators.required]],
            slug: [''],
            content: ['', [Validators.required]],
            excerpt: [''],
            category: ['OTHER', [Validators.required]],
            status: ['DRAFT', [Validators.required]],
            featuredImageUrl: [''],
            isFeatured: [false]
        });
    }

    ngOnInit() {
        this.postId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.postId) {
            this.isEditing.set(true);
            this.loadPost(this.postId);
        }
    }

    loadPost(id: number) {
        this.loading.set(true);
        this.blogService.getAllPostsAdmin(0, 100).subscribe({ // Temporary hack to find post, ideally getById endpoint
            next: (response) => {
                const post = response.content.find(p => p.id === id);
                if (post) {
                    this.postForm.patchValue({
                        title: post.title,
                        slug: post.slug,
                        content: post.content,
                        excerpt: post.excerpt,
                        category: post.category,
                        status: post.status,
                        featuredImageUrl: post.featuredImageUrl,
                        isFeatured: post.isFeatured
                    });
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading post:', err);
                this.loading.set(false);
            }
        });
    }

    onSubmit() {
        console.log('Intentando crear/actualizar publicación...');
        console.log('Datos del formulario:', this.postForm.value);
        console.log('Estado del formulario (Valid):', this.postForm.valid);

        if (this.postForm.invalid) {
            const errors: string[] = [];
            Object.keys(this.postForm.controls).forEach(key => {
                const control = this.postForm.get(key);
                if (control?.invalid) {
                    errors.push(key);
                    console.error(`Campo '${key}' inválido:`, control.errors);
                }
            });
            alert('El formulario es inválido. Por favor revisa los campos: ' + errors.join(', '));
            return;
        }

        this.loading.set(true);
        const postData = this.postForm.value;
        alert('Enviando datos al servidor...');

        if (this.isEditing() && this.postId) {
            this.blogService.updatePost(this.postId, postData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/blog']);
                },
                error: (err) => {
                    console.error('Error updating post:', err);
                    this.loading.set(false);
                }
            });
        } else {
            this.blogService.createPost(postData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/blog']);
                },
                error: (err) => {
                    console.error('Error creating post:', err);
                    alert('Error al crear la publicación: ' + (err.message || JSON.stringify(err)));
                    this.loading.set(false);
                }
            });
        }
    }
}
