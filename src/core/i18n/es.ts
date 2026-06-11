const es = {
  nav: {
    groups: 'Grupos',
    ranking: 'Ranking',
    bracket: 'Eliminatorias',
    logout: 'Salir',
  },
  home: {
    title: 'Mundialito 2026',
  },
  groups: {
    title: 'Fase de Grupos',
    group: 'Grupo',
    standings: 'Clasificación',
    fixtures: 'Partidos y Pronósticos',
    match: 'Partido',
    ft: 'Final',
    vs: 'vs',
  },
  groupDetail: {
    notFound: 'Grupo no encontrado',
    notFoundMessage: 'El grupo "{id}" no existe.',
    predictionSaved: '¡Pronóstico guardado!',
    noStandings: 'Sin clasificación disponible',
  },
  predictions: {
    homeScore: 'Goles local',
    awayScore: 'Goles visita',
    save: 'Guardar',
    update: 'Actualizar',
    pending: 'Pendiente',
  },
  ranking: {
    title: 'Ranking',
    player: 'Jugador',
    average: 'Promedio',
    points: 'Pts',
  },
  bracket: {
    title: 'Eliminatorias',
    r32: '32avos',
    r16: '16avos',
    qf: 'Cuartos',
    sf: 'Semifinales',
    final: 'Final',
    thirdPlace: '3er Puesto',
    note: 'Los cruces son fijos según el sorteo. El 3er puesto depende de qué 8 de 12 equipos de 3ros clasifiquen.',
  },
  profile: {
    title: 'Perfil',
    points: 'Puntos',
    rank: 'Ranking',
  },
  auth: {
    login: 'Iniciar Sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    loginButton: 'Ingresar',
    demoHint: 'Demo: demo@mundialito.app / 123456',
    loginError: 'Credenciales inválidas',
    loginSuccess: '¡Bienvenido!',
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
    empty: 'Sin datos',
    noPredictions: 'Sin pronósticos aún',
    noPredictionsDesc: 'Ve a un grupo y empieza a pronosticar.',
  },
  theme: {
    dark: 'Modo oscuro',
    light: 'Modo claro',
  },
}

export default es
export type TTranslationKey = keyof typeof es
