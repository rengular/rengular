import { TestBed } from "@angular/core/testing";
import { HttpHeaders, provideHttpClient } from "@angular/common/http";
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

  it("forwards custom headers on Get requests", () => {
    const headers = new HttpHeaders()
      .set("Authorization", "Bearer token")
      .set("X-Trace-Id", "abc-123");

    service.Get("users", { headers }).subscribe();

    const req = httpMock.expectOne("http://api.test/users");
    expect(req.request.headers.get("Authorization")).toBe("Bearer token");
    expect(req.request.headers.get("X-Trace-Id")).toBe("abc-123");
    req.flush([]);
  });

  it("forwards custom headers on Post requests", () => {
    const headers = new HttpHeaders().set("Authorization", "Bearer token");

    service.Post("users", { name: "ada" }, { headers }).subscribe();

    const req = httpMock.expectOne("http://api.test/users");
    expect(req.request.headers.get("Authorization")).toBe("Bearer token");
    req.flush({});
  });

  it("forwards custom headers on Patch requests", () => {
    const headers = new HttpHeaders().set("Authorization", "Bearer token");

    service.Patch("users/1", { name: "ada" }, { headers }).subscribe();

    const req = httpMock.expectOne("http://api.test/users/1");
    expect(req.request.headers.get("Authorization")).toBe("Bearer token");
    req.flush({});
  });

  it("forwards custom headers on Delete requests", () => {
    const headers = new HttpHeaders().set("Authorization", "Bearer token");

    service.Delete("users/1", { headers }).subscribe();

    const req = httpMock.expectOne("http://api.test/users/1");
    expect(req.request.headers.get("Authorization")).toBe("Bearer token");
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
