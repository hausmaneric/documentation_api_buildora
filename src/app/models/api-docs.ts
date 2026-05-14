export type ApiAuthMode = 'public' | 'master' | 'tenant';

export interface ApiPathParamDoc {
  name: string;
  label: string;
  description: string;
  defaultValue?: string;
}

export interface ApiHeaderDoc {
  name: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface ApiEndpointDoc {
  id: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  path: string;
  methods: string[];
  auth: ApiAuthMode;
  aliases?: string[];
  bodyRefs?: Partial<Record<string, string>>;
  pathParams?: ApiPathParamDoc[];
  headers?: ApiHeaderDoc[];
  queryRefs?: string[];
  notes?: string[];
}

export interface ApiReferenceBundle {
  routes?: any[];
  queries?: Record<string, any>;
  payloads?: Record<string, any>;
  examples?: Record<string, any>;
  responses?: Record<string, any>;
  smokePlan?: any;
  catalog?: any;
}

export interface PlaygroundSession {
  accountCode: string;
  masterLogin: string;
  masterPassword: string;
  tenantEmail: string;
  tenantPassword: string;
  masterToken: string;
  tenantToken: string;
}
