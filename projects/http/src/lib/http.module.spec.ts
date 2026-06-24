import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";

import { RengHttpModule } from "./http.module";
import { HttpService, SERVER_LOCATION } from "./http.service";

describe("RengHttpModule (compat)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
      imports: [RengHttpModule.forRoot("http://api.test/")],
    });
  });

  it("forRoot registers the server location", () => {
    expect(TestBed.inject(SERVER_LOCATION)).toBe("http://api.test/");
  });

  it("forRoot makes HttpService resolvable", () => {
    expect(TestBed.inject(HttpService)).toBeInstanceOf(HttpService);
  });
});
