import { TranslationKeys } from './en';

export const es: TranslationKeys = {
  // Navegación
  nav: {
    dashboard: 'Panel de Control',
    workspaces: 'Espacios de Trabajo',
    exchanges: 'Intercambios',
    documents: 'Documentos',
    clients: 'Clientes',
    auditLog: 'Registro de Auditoría',
    organizations: 'Organizaciones',
    users: 'Usuarios',
    capacity: 'Capacidad',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
  },

  // Acciones Comunes
  action: {
    view: 'Ver',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    update: 'Actualizar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    download: 'Descargar',
    upload: 'Subir',
    share: 'Compartir',
    send: 'Enviar',
    approve: 'Aprobar',
    reject: 'Rechazar',
    archive: 'Archivar',
    restore: 'Restaurar',
    selectAll: 'Seleccionar Todo',
    clearAll: 'Limpiar Todo',
    apply: 'Aplicar',
    reset: 'Restablecer',
    previous: 'Anterior',
    next: 'Siguiente',
    create: 'Crear',
    add: 'Agregar',
    remove: 'Quitar',
    copy: 'Copiar',
    duplicate: 'Duplicar',
  },

  // Panel de Control
  dashboard: {
    welcome: 'Bienvenido de nuevo',
    overview: 'Resumen',
    activeExchanges: 'Intercambios Activos',
    completedExchanges: 'Intercambios Completados',
    pendingReview: 'Pendientes de Revisión',
    expiringSoon: 'Por Vencer Pronto',
    recentActivity: 'Actividad Reciente',
    quickActions: 'Acciones Rápidas',
    createExchange: 'Crear Intercambio',
    viewAll: 'Ver Todo',
  },

  // Intercambios
  exchange: {
    title: 'Intercambios',
    createNew: 'Crear Nuevo Intercambio',
    exchangeId: 'ID de Intercambio',
    exchangeName: 'Nombre del Intercambio',
    workspace: 'Espacio de Trabajo',
    status: 'Estado',
    participants: 'Participantes',
    documents: 'Documentos',
    createdBy: 'Creado Por',
    createdDate: 'Fecha de Creación',
    expirationDate: 'Fecha de Vencimiento',
    lastActivity: 'Última Actividad',
    description: 'Descripción',
    noExchanges: 'No se encontraron intercambios',
    details: 'Detalles del Intercambio',
  },

  // Estado
  status: {
    draft: 'Borrador',
    active: 'Activo',
    inProgress: 'En Progreso',
    completed: 'Completado',
    expired: 'Vencido',
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    cancelled: 'Cancelado',
    success: 'Éxito',
    failed: 'Fallido',
  },

  // Espacios de Trabajo
  workspace: {
    title: 'Espacios de Trabajo',
    createNew: 'Crear Nuevo Espacio',
    workspaceName: 'Nombre del Espacio',
    workspaceType: 'Tipo de Espacio',
    description: 'Descripción',
    members: 'Miembros',
    exchanges: 'Intercambios',
    noWorkspaces: 'No se encontraron espacios de trabajo',
  },

  // Usuarios
  user: {
    title: 'Usuarios',
    name: 'Nombre',
    email: 'Correo Electrónico',
    role: 'Rol',
    status: 'Estado',
    lastLogin: 'Último Acceso',
    actions: 'Acciones',
    noUsers: 'No se encontraron usuarios',
  },

  // Roles
  role: {
    superAdmin: 'Super Administrador',
    tenantAdmin: 'Administrador de Organización',
    workspaceAdmin: 'Administrador de Espacio',
    primaryOperationsUser: 'Usuario de Operaciones',
    externalParticipant: 'Participante Externo',
  },

  // Registro de Auditoría
  audit: {
    title: 'Registros de Auditoría',
    timestamp: 'Marca de Tiempo',
    user: 'Usuario',
    action: 'Acción',
    resource: 'Recurso',
    details: 'Detalles',
    ipAddress: 'Dirección IP',
    noLogs: 'No se encontraron registros',
    exportLogs: 'Exportar Registros',
  },

  // Configuración
  settings: {
    title: 'Configuración',
    general: 'General',
    security: 'Seguridad',
    notifications: 'Notificaciones',
    integrations: 'Integraciones',
    branding: 'Marca',
    emailTemplates: 'Plantillas de Correo',
    theme: 'Tema',
    language: 'Idioma',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
  },

  // Firma Electrónica
  esign: {
    title: 'Firma Electrónica',
    reviewAndSign: 'Revisar y Firmar',
    completeSigning: 'Completar Firma',
    fieldsCompleted: 'campos completados',
    nextRequiredField: 'Siguiente Campo Requerido',
    signature: 'Firma',
    initials: 'Iniciales',
    date: 'Fecha',
    consentText: 'Acepto que mi firma electrónica es legalmente vinculante',
    signingComplete: 'Firma Completada Exitosamente',
    waitingForTurn: 'Esperando Tu Turno para Firmar',
  },

  // Mensajes
  message: {
    success: 'Operación completada exitosamente',
    error: 'Ocurrió un error',
    saved: 'Cambios guardados',
    deleted: 'Elemento eliminado',
    noResults: 'No se encontraron resultados',
    loading: 'Cargando...',
    required: 'Este campo es obligatorio',
    invalidEmail: 'Correo electrónico inválido',
    invalidDate: 'Fecha inválida',
  },

  // Filtros
  filter: {
    allStatuses: 'Todos los Estados',
    allWorkspaces: 'Todos los Espacios',
    allRoles: 'Todos los Roles',
    dateRange: 'Rango de Fechas',
    timeRange: 'Rango de Tiempo',
    clearFilters: 'Limpiar Todos los Filtros',
  },

  // Paginación
  pagination: {
    showing: 'Mostrando',
    of: 'de',
    results: 'resultados',
    page: 'Página',
    rowsPerPage: 'Filas por página',
  },
};
