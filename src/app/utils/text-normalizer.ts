const replacements: Array<[string, string]> = [
  ['Ã§', 'ç'],
  ['Ã£', 'ã'],
  ['Ã¡', 'á'],
  ['Ã¢', 'â'],
  ['Ãª', 'ê'],
  ['Ã©', 'é'],
  ['Ã­', 'í'],
  ['Ã³', 'ó'],
  ['Ãµ', 'õ'],
  ['Ãº', 'ú'],
  ['Ã€', 'À'],
  ['Ã', 'Á'],
  ['â', "'"],
  ['â', '–'],
  ['â', '—'],
  ['â¢', '•'],
  ['Âº', 'º'],
  ['Âª', 'ª'],
  ['Â', ''],
  ['Ã', 'Á'],
  ['Ã‰', 'É'],
  ['Ã“', 'Ó'],
  ['Ãš', 'Ú'],
  ['Ã‡', 'Ç'],
  ['Ãƒ', 'Ã'],
  ['NÃº', 'Nú'],
  ['nÃ£', 'não'],
  ['NÃ£', 'Não'],
  ['mÃ³', 'mó'],
  ['MÃ³', 'Mó'],
  ['UsuÃ¡', 'Usuá'],
  ['ConfiguraÃ§Ãµes', 'Configurações'],
  ['AplicaÃ§Ãµes', 'Aplicações'],
  ['DocumentaÃ§Ã£o', 'Documentação'],
  ['CÃ³digo', 'Código'],
  ['AutenticaÃ§Ã£o', 'Autenticação'],
  ['ProduÃ§Ã£o', 'Produção'],
  ['OperaÃ§Ã£o', 'Operação'],
  ['diÃ¡rio', 'diário'],
  ['DiÃ¡rio', 'Diário'],
  ['relatÃ³rios', 'relatórios'],
  ['RelatÃ³rios', 'Relatórios'],
  ['vÃ¡lido', 'válido'],
  ['PÃºblica', 'Pública'],
  ['pÃºblica', 'pública'],
  ['parÃ¢metros', 'parâmetros'],
  ['descriÃ§Ã£o', 'descrição'],
  ['versÃ£o', 'versão'],
  ['sessÃ£o', 'sessão'],
  ['Ãštil', 'Útil'],
  ['Ãºtil', 'útil'],
  ['conexÃ£o', 'conexão'],
  ['informaÃ§Ãµes', 'informações'],
  ['situaÃ§Ã£o', 'situação'],
  ['Ãªncias', 'ências']
];

export function normalizeText(value: string): string {
  let normalized = value;
  for (const [from, to] of replacements) {
    normalized = normalized.split(from).join(to);
  }
  return normalized;
}

export function normalizeDeep<T>(value: T): T {
  if (typeof value === 'string') {
    return normalizeText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeDeep(item)])
    ) as T;
  }

  return value;
}
