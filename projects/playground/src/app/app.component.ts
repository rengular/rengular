import { Component, inject, signal } from "@angular/core";
import { HttpService, rengHttpResource } from "@rengular/http";

interface Post {
  id: number;
  title: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  private readonly http = inject(HttpService);

  protected readonly title = "playground";

  /** `limit` is a signal, so changing it re-issues the resource request. */
  protected readonly limit = signal(5);

  /**
   * Reactive GET against `SERVER_LOCATION` + `posts?_limit=N` via the new
   * base-URL-aware `rengHttpResource`. Exposes value/status/error as signals.
   */
  protected readonly posts = rengHttpResource<Post[]>(
    () => `posts?_limit=${this.limit()}`
  );

  /** Id of the post created via the classic imperative observable API. */
  protected readonly lastCreatedId = signal<number | null>(null);

  protected more(): void {
    this.limit.update((n) => n + 5);
  }

  protected createPost(): void {
    this.http
      .Post<Post>("posts", { title: "rengular", body: "hi", userId: 1 })
      .subscribe((created) => this.lastCreatedId.set(created.id));
  }
}
