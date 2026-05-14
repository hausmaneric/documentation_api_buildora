import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiDocsService } from '../../services/api-docs.service';
import { ApiAuthMode, ApiEndpointDoc, ApiReferenceBundle, PlaygroundSession } from '../../models/api-docs';

@Component({
  selector: 'app-api-reference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-reference.component.html',
  styleUrl: './api-reference.component.scss'
})
export class ApiReferenceComponent {
  loading = true;
  categories: string[] = [];
  endpoints: ApiEndpointDoc[] = [];
  filteredEndpoints: ApiEndpointDoc[] = [];
  selectedCategory = '';
  selectedEndpoint: ApiEndpointDoc | null = null;
  selectedMethod = 'GET';
  endpointSearch = '';

  session: PlaygroundSession;
  authMode: ApiAuthMode = 'public';
  requestBody = '{}';
  customHeaders = '{}';
  queryParams = '{}';
  pathParams: Record<string, string> = {};
  requestPreview = '';
  responseStatus = '';
  responseBody = '';
  requestRunning = false;
  authLoading = false;
  message = '';
  bundle: ApiReferenceBundle = {};

  constructor(private apiDocsService: ApiDocsService) {
    this.session = this.apiDocsService.getStoredSession();
  }

  ngOnInit(): void {
    this.loadReference();
  }

  loadReference(): void {
    this.loading = true;
    this.apiDocsService
      .loadReferenceBundle()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (bundle) => {
          this.bundle = bundle;
          this.endpoints = this.apiDocsService.buildCompleteCatalog(bundle);
          this.categories = [...new Set(this.endpoints.map((endpoint) => endpoint.category))];
          this.selectedCategory = this.categories[0] ?? '';
          this.applyFilter();
          this.selectEndpoint(this.filteredEndpoints[0] ?? null);
        },
        error: () => {
          this.message = 'Não foi possível carregar a referência pública da API.';
        }
      });
  }

  applyFilter(): void {
    const normalized = this.endpointSearch.trim().toLowerCase();
    this.filteredEndpoints = this.endpoints.filter((endpoint) => {
      const inCategory = !this.selectedCategory || endpoint.category === this.selectedCategory;
      if (!inCategory) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      return (
        endpoint.title.toLowerCase().includes(normalized) ||
        endpoint.path.toLowerCase().includes(normalized) ||
        endpoint.summary.toLowerCase().includes(normalized)
      );
    });
  }

  changeCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
    this.selectEndpoint(this.filteredEndpoints[0] ?? null);
  }

  selectEndpoint(endpoint: ApiEndpointDoc | null): void {
    this.selectedEndpoint = endpoint;
    if (!endpoint) {
      return;
    }

    this.selectedMethod = endpoint.methods[0] ?? 'GET';
    this.authMode = this.apiDocsService.detectAuthMode(endpoint);
    this.pathParams = Object.fromEntries((endpoint.pathParams ?? []).map((item) => [item.name, item.defaultValue ?? '']));
    this.requestBody = this.buildExampleBody(endpoint, this.selectedMethod);
    this.customHeaders = JSON.stringify(this.buildDefaultHeaders(endpoint), null, 2);
    this.queryParams = JSON.stringify(this.buildDefaultQueryParams(endpoint), null, 2);
    this.buildRequestPreview();
  }

  buildDefaultHeaders(endpoint: ApiEndpointDoc): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const header of endpoint.headers ?? []) {
      headers[header.name] = header.defaultValue ?? '';
    }
    return headers;
  }

  buildDefaultQueryParams(endpoint: ApiEndpointDoc): Record<string, string> {
    const query: Record<string, string> = {};
    for (const key of endpoint.queryRefs ?? []) {
      if (key === 'limit') {
        query[key] = '20';
      } else if (key === 'offset') {
        query[key] = '0';
      } else if (key === 'sort_direction') {
        query[key] = 'desc';
      } else {
        query[key] = '';
      }
    }
    return query;
  }

  buildExampleBody(endpoint: ApiEndpointDoc, method: string): string {
    const bodyRef = endpoint.bodyRefs?.[method];
    if (!bodyRef) {
      return '{}';
    }

    const example = (this.bundle.examples ?? {})[bodyRef];
    if (example) {
      return JSON.stringify(example, null, 2);
    }

    const payload = (this.bundle.payloads ?? {})[bodyRef];
    if (!payload) {
      return '{}';
    }

    const shape: Record<string, string> = {};
    for (const field of payload.required_fields ?? []) {
      shape[field] = '';
    }
    return JSON.stringify(shape, null, 2);
  }

  resolvePath(endpoint: ApiEndpointDoc): string {
    let path = endpoint.path;
    const token = this.authMode === 'tenant' ? this.session.tenantToken : this.session.masterToken;

    path = path.replaceAll('<token_id>', token || 'SEU_TOKEN');
    path = path.replaceAll('<int:record_id>', this.pathParams['record_id'] || '1');
    path = path.replaceAll('<record_id>', this.pathParams['record_id'] || '1');
    path = path.replaceAll('<int:diary_id>', this.pathParams['diary_id'] || '1');
    path = path.replaceAll('<diary_id>', this.pathParams['diary_id'] || '1');
    path = path.replaceAll('<entity>', this.pathParams['entity'] || 'projects');
    return path;
  }

  buildRequestPreview(): void {
    if (!this.selectedEndpoint) {
      return;
    }

    const path = this.resolvePath(this.selectedEndpoint);
    const url = new URL(path, this.apiDocsService.getBaseUrl());
    const query = this.safeParse(this.queryParams, {});

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    this.requestPreview = `${this.selectedMethod} ${url.toString()}`;
  }

  loginMaster(): void {
    this.authLoading = true;
    this.apiDocsService
      .masterLogin(this.session.masterLogin, this.session.masterPassword)
      .pipe(finalize(() => (this.authLoading = false)))
      .subscribe({
        next: (response) => {
          this.session.masterToken = response?.data?.token ?? '';
          this.persistSession('Token master carregado com sucesso.');
        },
        error: () => {
          this.message = 'Falha ao autenticar no fluxo master.';
        }
      });
  }

  loginTenant(): void {
    this.authLoading = true;
    this.apiDocsService
      .tenantLogin(this.session.accountCode, this.session.tenantEmail, this.session.tenantPassword)
      .pipe(finalize(() => (this.authLoading = false)))
      .subscribe({
        next: (response) => {
          this.session.tenantToken = response?.data?.token ?? '';
          this.persistSession('Token tenant carregado com sucesso.');
        },
        error: () => {
          this.message = 'Falha ao autenticar no fluxo tenant.';
        }
      });
  }

  persistSession(message?: string): void {
    this.apiDocsService.saveSession(this.session);
    this.message = message ?? '';
    this.buildRequestPreview();
  }

  runRequest(): void {
    if (!this.selectedEndpoint || this.requestRunning) {
      return;
    }

    this.requestRunning = true;
    this.responseStatus = '';
    this.responseBody = '';
    this.message = '';

    const path = this.resolvePath(this.selectedEndpoint);
    const url = new URL(path, this.apiDocsService.getBaseUrl());
    const query = this.safeParse(this.queryParams, {});
    const headers = {
      ...this.buildDefaultHeaders(this.selectedEndpoint),
      ...this.safeParse(this.customHeaders, {})
    } as Record<string, string>;

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    let body: unknown;
    if (!['GET', 'DELETE'].includes(this.selectedMethod)) {
      body = this.safeParse(this.requestBody, {});
      headers['Content-Type'] = 'application/json';
    }

    this.apiDocsService
      .requestEndpoint(this.selectedMethod, url.toString(), { headers, body })
      .pipe(finalize(() => (this.requestRunning = false)))
      .subscribe({
        next: (response: any) => {
          this.responseStatus = `${response.status} ${response.statusText}`;
          this.responseBody = JSON.stringify(response.body, null, 2);
        },
        error: (error: HttpErrorResponse) => {
          this.responseStatus = `${error.status} ${error.statusText}`;
          const bodyOutput = typeof error.error === 'string' ? error.error : JSON.stringify(error.error, null, 2);
          this.responseBody = bodyOutput;
        }
      });
  }

  getPayloadReference(method: string): any {
    const ref = this.selectedEndpoint?.bodyRefs?.[method];
    return ref ? (this.bundle.payloads ?? {})[ref] : null;
  }

  getResponseReference(): any {
    const endpointKey = this.selectedEndpoint?.id;
    if (!endpointKey) {
      return null;
    }
    return (this.bundle.responses ?? {})[endpointKey] ?? null;
  }

  private safeParse<T>(value: string, fallback: T): T {
    try {
      return value.trim() ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}
