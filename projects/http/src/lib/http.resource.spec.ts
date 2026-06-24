import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { signal } from "@angular/core";

import { rengHttpResource } from "./http.resource";
import { SERVER_LOCATION } from "./http.service";

describe("rengHttpResource", () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SERVER_LOCATION, useValue: "http://api.test/" },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("prepends the server location to the resource request and exposes the value", async () => {
    const res = TestBed.runInInjectionContext(() =>
      rengHttpResource<{ id: number }[]>(() => "users")
    );

    TestBed.tick();
    const req = httpMock.expectOne("http://api.test/users");
    expect(req.request.method).toBe("GET");

    req.flush([{ id: 1 }]);
    await Promise.resolve();
    TestBed.tick();

    expect(res.value()).toEqual([{ id: 1 }]);
  });

  it("uses an absolute endpoint as-is, bypassing the base url", () => {
    TestBed.runInInjectionContext(() =>
      rengHttpResource(() => "https://other.test/v2/users")
    );

    TestBed.tick();
    const req = httpMock.expectOne("https://other.test/v2/users");
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("refetches when a reactive dependency changes", () => {
    const id = signal(1);
    TestBed.runInInjectionContext(() =>
      rengHttpResource(() => `users/${id()}`)
    );

    TestBed.tick();
    httpMock.expectOne("http://api.test/users/1").flush({});

    id.set(2);
    TestBed.tick();
    httpMock.expectOne("http://api.test/users/2").flush({});
  });

  it("stays idle (no request) for an empty endpoint", () => {
    TestBed.runInInjectionContext(() => rengHttpResource(() => undefined));

    TestBed.tick();
    httpMock.expectNone(() => true);
  });
});
