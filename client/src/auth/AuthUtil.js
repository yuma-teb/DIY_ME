const AuthUtil = {
  validateEmail: (email) => {
    // Replace this with your email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

export default AuthUtil;
