import { User2 } from "lucide-react";

export function AuthorProfile() {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 p-6 rounded-2xl bg-muted/30 border mt-12 mb-8">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <User2 className="h-10 w-10" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-1">Kuldeep Bahl</h3>
        <p className="text-sm font-medium text-foreground mb-3">
          Professional Software Engineer
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>&bull; B.Tech (Hons.) Computer Science & Engineering</li>
          <li>&bull; 14+ years of corporate technology experience</li>
          <li>&bull; Focus areas: Software Development, Web Applications, Automation, Digital Tools, Technology Education</li>
        </ul>
      </div>
    </div>
  );
}
