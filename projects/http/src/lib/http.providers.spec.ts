import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";

import { provideRengHttp } from "./http.providers";
import { HttpService, SERVER_LOCATION } from "./http.service";

describe("provideRengHttp", () => {
  it("registers the server location", () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRengHttp("http://api.test/")],
    });

    expect(TestBed.inject(SERVER_LOCATION)).toBe("http://api.test/");
  });

  it("makes HttpService resolvable", () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRengHttp("http://api.test/")],
    });

    expect(TestBed.inject(HttpService)).toBeInstanceOf(HttpService);
  });
});
