function PublicFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <p>
                &copy; {currentYear} SommelierIQ
            </p>
        </footer>
    );
}

export default PublicFooter;