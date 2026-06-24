import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideRengHttp } from "@rengular/http";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRengHttp("http://api.test/"),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("creates the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    httpMock.expectOne("http://api.test/posts?_limit=5").flush([]);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("renders posts loaded through the resource", async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    httpMock
      .expectOne("http://api.test/posts?_limit=5")
      .flush([{ id: 1, title: "hello rengular" }]);

    // The resource resolves its value on a microtask; wait for it before render.
    await fixture.whenStable();
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain("hello rengular");
  });
});
