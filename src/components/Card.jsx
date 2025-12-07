export const Card = ({ children, className = '', title }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h3 className="heading-sm mb-4 text-gray-400">{title}</h3>}
            {children}
        </div>
    )
}
