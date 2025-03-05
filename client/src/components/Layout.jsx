const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar - Fixed to Top */}
            <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <div className="container mx-auto p-4">Your Navbar</div>
            </nav>

            {/* Main Content Wrapper with Padding for Consistency */}
            <main className="pt-[64px] px-4 md:px-8 lg:px-16 flex-grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;
