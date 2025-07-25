const LoginType = {
  SYSTEM: 1,
  GOOGLE: 2,
  FACEBOOK: 3,

  labels: {
    1: 'System',
    2: 'Google',
    3: 'Facebook',
  },

  getLabel(value) {
    return LoginType.labels[value] || 'Unknown';
  }
};