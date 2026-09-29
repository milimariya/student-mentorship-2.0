const Card = ({ title, children, size = 'md' }) => {
  return (
    <div className={`card card-${size}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
