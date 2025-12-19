import { GET } from "./route";

type FetchMockResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
  text?: () => Promise<string>;
};

describe("GET /api/weather", () => {
  const originalFetch = global.fetch;

  // Sample mock data returned by OpenWeatherMap API
  const mockWeatherData = {
    main: { temp: 22.5 },
    name: "Cape Town",
    sys: { country: "ZA" },
    weather: [{ description: "clear sky" }],
  };

  beforeEach(() => {
    // Ensure the API key is set before each test
    process.env.OPEN_WEATHER_API_KEY = "fake-api-key";
    jest.resetAllMocks();
  });

  afterEach(() => {
    // Restore original fetch to avoid affecting other tests
    global.fetch = originalFetch;
  });

  it("returns formatted weather data on success", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockWeatherData,
    } as FetchMockResponse as Response);

    global.fetch = fetchMock;

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      temperature: 23, // temperature is rounded
      city: "Cape Town",
      country: "ZA",
      description: "clear sky",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("lat=-33.9258&lon=18.4232")
    );
  });

  it("returns 500 if API key is missing", async () => {
    delete process.env.OPEN_WEATHER_API_KEY;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Missing API key" });
  });

  it("handles non-ok fetch responses", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => "some error",
    } as FetchMockResponse as Response);

    global.fetch = fetchMock;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to fetch weather" });
  });

  it("handles fetch throwing an exception", async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error("Network down"));

    global.fetch = fetchMock;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Server error" });
  });
});
