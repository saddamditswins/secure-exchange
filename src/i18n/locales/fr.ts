import { TranslationKeys } from './en';

export const fr: TranslationKeys = {
  // Navigation
  nav: {
    dashboard: 'Tableau de Bord',
    workspaces: 'Espaces de Travail',
    exchanges: 'Échanges',
    documents: 'Documents',
    clients: 'Clients',
    auditLog: 'Journal d\'Audit',
    organizations: 'Organisations',
    users: 'Utilisateurs',
    capacity: 'Capacité',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
  },

  // Actions Communes
  action: {
    view: 'Voir',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    update: 'Mettre à Jour',
    cancel: 'Annuler',
    close: 'Fermer',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    download: 'Télécharger',
    upload: 'Téléverser',
    share: 'Partager',
    send: 'Envoyer',
    approve: 'Approuver',
    reject: 'Rejeter',
    archive: 'Archiver',
    restore: 'Restaurer',
    selectAll: 'Tout Sélectionner',
    clearAll: 'Tout Effacer',
    apply: 'Appliquer',
    reset: 'Réinitialiser',
    previous: 'Précédent',
    next: 'Suivant',
    create: 'Créer',
    add: 'Ajouter',
    remove: 'Retirer',
    copy: 'Copier',
    duplicate: 'Dupliquer',
  },

  // Tableau de Bord
  dashboard: {
    welcome: 'Bon retour',
    overview: 'Vue d\'Ensemble',
    activeExchanges: 'Échanges Actifs',
    completedExchanges: 'Échanges Complétés',
    pendingReview: 'En Attente de Révision',
    expiringSoon: 'Expire Bientôt',
    recentActivity: 'Activité Récente',
    quickActions: 'Actions Rapides',
    createExchange: 'Créer un Échange',
    viewAll: 'Voir Tout',
  },

  // Échanges
  exchange: {
    title: 'Échanges',
    createNew: 'Créer un Nouvel Échange',
    exchangeId: 'ID d\'Échange',
    exchangeName: 'Nom de l\'Échange',
    workspace: 'Espace de Travail',
    status: 'Statut',
    participants: 'Participants',
    documents: 'Documents',
    createdBy: 'Créé Par',
    createdDate: 'Date de Création',
    expirationDate: 'Date d\'Expiration',
    lastActivity: 'Dernière Activité',
    description: 'Description',
    noExchanges: 'Aucun échange trouvé',
    details: 'Détails de l\'Échange',
  },

  // Statut
  status: {
    draft: 'Brouillon',
    active: 'Actif',
    inProgress: 'En Cours',
    completed: 'Complété',
    expired: 'Expiré',
    pending: 'En Attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    cancelled: 'Annulé',
    success: 'Succès',
    failed: 'Échoué',
  },

  // Espaces de Travail
  workspace: {
    title: 'Espaces de Travail',
    createNew: 'Créer un Nouvel Espace',
    workspaceName: 'Nom de l\'Espace',
    workspaceType: 'Type d\'Espace',
    description: 'Description',
    members: 'Membres',
    exchanges: 'Échanges',
    noWorkspaces: 'Aucun espace de travail trouvé',
  },

  // Utilisateurs
  user: {
    title: 'Utilisateurs',
    name: 'Nom',
    email: 'E-mail',
    role: 'Rôle',
    status: 'Statut',
    lastLogin: 'Dernière Connexion',
    actions: 'Actions',
    noUsers: 'Aucun utilisateur trouvé',
  },

  // Rôles
  role: {
    superAdmin: 'Super Administrateur',
    tenantAdmin: 'Administrateur d\'Organisation',
    workspaceAdmin: 'Administrateur d\'Espace',
    primaryOperationsUser: 'Utilisateur d\'Opérations',
    externalParticipant: 'Participant Externe',
  },

  // Journal d'Audit
  audit: {
    title: 'Journaux d\'Audit',
    timestamp: 'Horodatage',
    user: 'Utilisateur',
    action: 'Action',
    resource: 'Ressource',
    details: 'Détails',
    ipAddress: 'Adresse IP',
    noLogs: 'Aucun journal trouvé',
    exportLogs: 'Exporter les Journaux',
  },

  // Paramètres
  settings: {
    title: 'Paramètres',
    general: 'Général',
    security: 'Sécurité',
    notifications: 'Notifications',
    integrations: 'Intégrations',
    branding: 'Image de Marque',
    emailTemplates: 'Modèles d\'E-mail',
    theme: 'Thème',
    language: 'Langue',
    darkMode: 'Mode Sombre',
    lightMode: 'Mode Clair',
  },

  // Signature Électronique
  esign: {
    title: 'Signature Électronique',
    reviewAndSign: 'Réviser et Signer',
    completeSigning: 'Terminer la Signature',
    fieldsCompleted: 'champs complétés',
    nextRequiredField: 'Prochain Champ Requis',
    signature: 'Signature',
    initials: 'Initiales',
    date: 'Date',
    consentText: 'J\'accepte que ma signature électronique soit juridiquement contraignante',
    signingComplete: 'Signature Complétée avec Succès',
    waitingForTurn: 'En Attente de Votre Tour pour Signer',
  },

  // Messages
  message: {
    success: 'Opération complétée avec succès',
    error: 'Une erreur s\'est produite',
    saved: 'Modifications enregistrées',
    deleted: 'Élément supprimé',
    noResults: 'Aucun résultat trouvé',
    loading: 'Chargement...',
    required: 'Ce champ est obligatoire',
    invalidEmail: 'Adresse e-mail invalide',
    invalidDate: 'Date invalide',
  },

  // Filtres
  filter: {
    allStatuses: 'Tous les Statuts',
    allWorkspaces: 'Tous les Espaces',
    allRoles: 'Tous les Rôles',
    dateRange: 'Plage de Dates',
    timeRange: 'Plage de Temps',
    clearFilters: 'Effacer Tous les Filtres',
  },

  // Pagination
  pagination: {
    showing: 'Affichage',
    of: 'de',
    results: 'résultats',
    page: 'Page',
    rowsPerPage: 'Lignes par page',
  },
};
