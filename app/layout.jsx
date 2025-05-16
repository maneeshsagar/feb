'use client';
import '@styles/global.css'


export const metadat = {
    title: "",
    description: ""
}

const RootLayout = ({children}) => {
    return (
        <html lang='en'>
            <body>
         
                <main className='app'>
                    {children}
                </main>
            </body>
        </html>
    )
}

export default RootLayout;
