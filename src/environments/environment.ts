export const environment = {
    production: false,
    MARVEL_API: {
        URL: 'https://gateway.marvel.com:443',
        PUBLIC_KEY: 'INSERT YOUR KEY FIRST',
        PRIVATE_KEY: 'INSERT YOUR KEY FIRST',
    },
};

if (environment.MARVEL_API.PUBLIC_KEY === 'INSERT YOUR KEY FIRST') {
    /**
     * To get access to the marvel API, you need to go to their site and sign up for an account.
     * Go Here: https://developer.marvel.com/
     *
     * Once you have done that, in their portal, you will need to add http://localhost to their
     * whitelisted domains. If you don't do this, it will fail for you.
     */
    document.body.innerHTML = `You need to insert your Marvel API key before you begin. <BR>
            Open your <code>environments.ts</code> file and add your Marvel keys on line 4 and 5<BR><BR>
            If you are seeing this, and don't understand why, please let the Frosty know<BR>
            and he will help you out.`;

    throw new Error('You must setup a public and private API key first.');
}
