import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { endpointCatalog } from '../data/api-endpoints.catalog';
import { ApiAuthMode, ApiEndpointDoc, ApiReferenceBundle, PlaygroundSession } from '../models/api-docs';
import { apiURL, defaultAccountCode, docsStorageKey } from '../resources';
import { normalizeDeep } from '../utils/text-normalizer';

@Injectable({ providedIn: 'root' })
export class ApiDocsService {
  constructor(private http: HttpClient) {}

  getBaseUrl(): string {
    return apiURL;
  }

  getStaticCatalog(): ApiEndpointDoc[] {
    return normalizeDeep(endpointCatalog);
  }

  loadReferenceBundle(): Observable<ApiReferenceBundle> {
    return forkJoin({
      routes: this.http.get<any>(`${apiURL}routes`).pipe(map((result) => result?.data?.routes ?? []), catchError(() => of([]))),
      queries: this.http.get<any>(`${apiURL}queries`).pipe(map((result) => result?.data?.queries ?? {}), catchError(() => of({}))),
      payloads: this.http.get<any>(`${apiURL}payloads`).pipe(map((result) => result?.data?.payloads ?? {}), catchError(() => of({}))),
      examples: this.http.get<any>(`${apiURL}examples`).pipe(map((result) => result?.data ?? {}), catchError(() => of({}))),
      responses: this.http.get<any>(`${apiURL}responses`).pipe(map((result) => result?.data?.responses ?? {}), catchError(() => of({}))),
      smokePlan: this.http.get<any>(`${apiURL}smoke-plan`).pipe(map((result) => result?.data ?? null), catchError(() => of(null))),
      catalog: this.http.get<any>(`${apiURL}catalog`).pipe(map((result) => result?.data ?? null), catchError(() => of(null)))
    }).pipe(map((bundle) => normalizeDeep(bundle)));
  }

  getStoredSession(): PlaygroundSession {
    const fallback: PlaygroundSession = {
      accountCode: defaultAccountCode,
      masterLogin: 'admin',
      masterPassword: '123456',
      tenantEmail: 'admin@buildora001.com',
      tenantPassword: '123456',
      masterToken: '',
      tenantToken: ''
    };

    const raw = localStorage.getItem(docsStorageKey);
    if (!raw) {
      return fallback;
    }

    try {
      return { ...fallback, ...(JSON.parse(raw) as Partial<PlaygroundSession>) };
    } catch {
      return fallback;
    }
  }

  saveSession(session: PlaygroundSession): void {
    localStorage.setItem(docsStorageKey, JSON.stringify(session));
  }

  masterLogin(login: string, password: string): Observable<any> {
    return this.http.post(`${apiURL}auth/master/login/`, { login, password });
  }

  tenantLogin(accountCode: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${apiURL}auth/tenant/login/`,
      { email, password },
      { headers: new HttpHeaders({ 'X-Account-Code': accountCode }) }
    );
  }

  requestEndpoint(
    method: string,
    url: string,
    options: {
      headers?: Record<string, string>;
      body?: unknown;
    }
  ): Observable<any> {
    const normalizedHeaders = new HttpHeaders(options.headers ?? {});
    const requestOptions: Record<string, unknown> = {
      headers: normalizedHeaders,
      observe: 'response'
    };

    if (!['GET', 'DELETE'].includes(method.toUpperCase()) && options.body !== undefined) {
      requestOptions['body'] = options.body;
    }

    return this.http.request(method.toUpperCase(), url, requestOptions);
  }

  buildCompleteCatalog(bundle: ApiReferenceBundle): ApiEndpointDoc[] {
    const base = this.getStaticCatalog();
    const knownPaths = new Set<string>();

    base.forEach((item) => {
      knownPaths.add(item.path);
      (item.aliases ?? []).forEach((alias) => knownPaths.add(alias));
    });

    const discovered = (bundle.routes ?? [])
      .filter((route) => !knownPaths.has(route.path))
      .map(
        (route): ApiEndpointDoc => ({
          id: route.endpoint,
          category: 'Rotas adicionais',
          title: route.endpoint,
          summary: 'Rota descoberta automaticamente.',
          description: 'Esta rota foi encontrada no catálogo público da API, mas ainda não recebeu descrição curada nesta documentação.',
          path: route.path,
          methods: route.methods ?? ['GET'],
          auth: route.requires_token_path ? 'tenant' : 'public'
        })
      );

    return [...base, ...discovered].sort((a, b) => {
      if (a.category === b.category) {
        return a.title.localeCompare(b.title);
      }
      return a.category.localeCompare(b.category);
    });
  }

  detectAuthMode(endpoint: ApiEndpointDoc): ApiAuthMode {
    return endpoint.auth;
  }
}
