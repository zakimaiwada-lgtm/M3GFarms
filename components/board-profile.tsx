import { Sprout } from "lucide-react";

export function BoardProfile({ name, initials, role, photo }: {
  name: string; initials: string; role: string; photo?: string;
}) {
  return <article className="leader-card">
    {photo ? <img className="board-portrait" src={photo} alt={name} loading="lazy" width={240} height={240}/> :
      <span className="avatar" aria-label={`Portrait of ${name} not yet supplied`}>{initials}<Sprout size={18}/></span>}
    <h3>{name}</h3><p>{role}</p>
  </article>;
}
