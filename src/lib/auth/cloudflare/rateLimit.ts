const rateLimit = {
    enabled: true,
    window: 60, // Minimum KV TTL is 60s
    max: 100, // reqs/window
    customRules: {
        // https://github.com/better-auth/better-auth/issues/5452
        "/sign-in/email": {
            window: 60,
            max: 100,
        },
        "/sign-in/social": {
            window: 60,
            max: 100,
        },
    },
};

export default rateLimit;
