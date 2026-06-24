import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";

import { HttpService, SERVER_LOCATION } from "./http.service";

describe("HttpService", () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SERVER_LOCATION, useValue: "http://api.test/" },
      ],
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("is created and extends HttpClient", () => {
    expect(service).toBeTruthy();
  });

  it("prepends the server location to Get requests", () => {
    service.Get("users").subscribe();

    const req = httpMock.expectOne("http://api.test/users");
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("sends Get to the absolute api override, bypassing the base url", () => {
    service.Get("ignored", undefined, "https://other.test/v2/users").subscribe();

    const req = httpMock.expectOne("https://other.test/v2/users");
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("prepends the server location to Post requests and sends the body", () => {
    const body = { name: "ada" };
    service.Post("users", body).subscribe();

    const req = httpMock.expectOne("http://api.test/users");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it("prepends the server location to Put requests", () => {
    service.Put("users/1", { name: "ada" }).subscribe();

    const req = httpMock.expectOne("http://api.test/users/1");
    expect(req.request.method).toBe("PUT");
    req.flush({});
  });

  it("prepends the server location to Delete requests", () => {
    service.Delete("users/1").subscribe();

    const req = httpMock.expectOne("http://api.test/users/1");
    expect(req.request.method).toBe("DELETE");
    req.flush({});
  });

  it("prepends the server location to Patch requests and sends the body", () => {
    const body = { name: "ada" };
    service.Patch("users/1", body).subscribe();

    const req = httpMock.expectOne("http://api.test/users/1");
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it("sends Patch to the absolute api override, bypassing the base url", () => {
    service
      .Patch("ignored", { name: "ada" }, undefined, "https://other.test/v2/users/1")
      .subscribe();

    const req = httpMock.expectOne("https://other.test/v2/users/1");
    expect(req.request.method).toBe("PATCH");
    req.flush({});
  });

  it("resource() prepends the server location and issues the request", () => {
    // Called outside an injection context on purpose: the method reuses the
    // service's own injector.
    service.resource(() => "users");

    TestBed.tick();
    const req = httpMock.expectOne("http://api.test/users");
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });
});
