export default function Section({ id, children, className = "" }) {
  // generic wrapper used across sections for consistent padding and container
  return (
    <section id={id} className={`py-20 px-6 ${className}`}> 
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
