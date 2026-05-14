export const applicationsOverview = [
  {
    id: 'api',
    title: 'API Buildora',
    subtitle: 'Núcleo central da plataforma',
    tone: 'primary',
    bullets: [
      'Centraliza autenticação master e tenant.',
      'Expõe rotas administrativas, operacionais, de diário, produção e relatórios.',
      'Resolve a empresa pelo header X-Account-Code e controla o acesso por token.'
    ]
  },
  {
    id: 'admin',
    title: 'Web de administração',
    subtitle: 'Controle do SaaS e onboarding',
    tone: 'accent',
    bullets: [
      'Gerencia contas, planos, módulos, usuários master e setup inicial.',
      'Permite bootstrap do tenant, checagens de ambiente e manutenção administrativa.',
      'É a ferramenta de operação do time Buildora.'
    ]
  },
  {
    id: 'tenant-web',
    title: 'Web do cliente',
    subtitle: 'Operação diária da empresa',
    tone: 'success',
    bullets: [
      'Acessa obras, equipes, diário de obra, produção, auditoria e relatórios.',
      'Usa autenticação tenant e respeita permissões por papel.',
      'Consome o banco dedicado de cada empresa.'
    ]
  },
  {
    id: 'field-app',
    title: 'App de campo',
    subtitle: 'Uso operacional em obra',
    tone: 'warning',
    bullets: [
      'Registra diário, apontamentos, equipes, materiais, equipamentos e evidências.',
      'Pode usar a mesma API do tenant com foco em experiência mobile.',
      'Deve operar com o mesmo account code e o mesmo token tenant.'
    ]
  },
  {
    id: 'master-db',
    title: 'Banco master',
    subtitle: 'Metadados da plataforma',
    tone: 'neutral',
    bullets: [
      'Guarda contas, planos, módulos, vínculos e usuários master.',
      'É o ponto de governança central do ambiente SaaS.',
      'Também sustenta setup público e automações administrativas.'
    ]
  },
  {
    id: 'tenant-db',
    title: 'Banco por empresa',
    subtitle: 'Isolamento multi-tenant real',
    tone: 'danger',
    bullets: [
      'Cada empresa aponta para seu próprio banco de operação.',
      'O painel admin decide se a conta está ativa, expirada ou bloqueada.',
      'Ao suspender a conta, app e web do cliente devem perder o acesso.'
    ]
  }
];

export const implementationFlow = [
  'Executar o setup público e criar o primeiro usuário master.',
  'Logar no master e cadastrar a conta da empresa.',
  'Vincular plano, módulos e banco tenant da empresa.',
  'Executar o bootstrap do tenant usando X-Account-Code.',
  'Logar no tenant e seguir para obras, diário e produção.'
];
