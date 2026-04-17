// OpenAPI 3.0.0 Schema for Quran API
export function getOpenAPISchema() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Quran API",
      description:
        "A scalable, production-ready Quran API with full-text search, caching, and rate limiting",
      version: "1.0.0",
      contact: {
        name: "API Support",
        url: "https://github.com/yourusername/quran-api",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Surahs",
        description: "Operations related to Surahs (chapters of the Quran)",
      },
      {
        name: "Search",
        description: "Search operations for Ayahs",
      },
      {
        name: "System",
        description: "System health and information endpoints",
      },
    ],
    paths: {
      "/api/v1/surahs": {
        get: {
          tags: ["Surahs"],
          summary: "Get all Surahs",
          description:
            "Retrieve a list of all 114 Surahs of the Quran with metadata",
          operationId: "getAllSurahs",
          responses: {
            "200": {
              description: "Successfully retrieved all Surahs",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Surah",
                        },
                      },
                      metadata: {
                        type: "object",
                        properties: {
                          total: { type: "integer", example: 114 },
                          cached: { type: "boolean", example: true },
                          timestamp: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "429": {
              description: "Rate limit exceeded",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/v1/surah/{id}": {
        get: {
          tags: ["Surahs"],
          summary: "Get Surah by ID",
          description: "Retrieve a specific Surah with all its Ayahs",
          operationId: "getSurahById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Surah ID (1-114)",
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 114,
              },
            },
          ],
          responses: {
            "200": {
              description: "Successfully retrieved Surah",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/SurahDetail" },
                      metadata: {
                        type: "object",
                        properties: {
                          timestamp: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid Surah ID",
            },
            "404": {
              description: "Surah not found",
            },
            "429": {
              description: "Rate limit exceeded",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/v1/search": {
        get: {
          tags: ["Search"],
          summary: "Search Ayahs",
          description: "Search Ayahs by text with pagination support",
          operationId: "searchAyahs",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              description: "Search query (minimum 2 characters)",
              schema: {
                type: "string",
                minLength: 2,
              },
            },
            {
              name: "page",
              in: "query",
              required: false,
              description: "Page number for pagination",
              schema: {
                type: "integer",
                default: 1,
                minimum: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              required: false,
              description: "Number of results per page (max 100)",
              schema: {
                type: "integer",
                default: 20,
                minimum: 1,
                maximum: 100,
              },
            },
          ],
          responses: {
            "200": {
              description: "Successfully retrieved search results",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/SearchResult" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          page: { type: "integer", example: 1 },
                          limit: { type: "integer", example: 20 },
                          total: { type: "integer", example: 45 },
                          totalPages: { type: "integer", example: 3 },
                        },
                      },
                      metadata: {
                        type: "object",
                        properties: {
                          query: { type: "string" },
                          timestamp: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid search parameters",
            },
            "429": {
              description: "Rate limit exceeded",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      "/api/v1/health": {
        get: {
          tags: ["System"],
          summary: "Health check",
          description: "Check API health status",
          operationId: "healthCheck",
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          status: { type: "string", example: "healthy" },
                          timestamp: { type: "string" },
                          version: { type: "string", example: "1.0.0" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/info": {
        get: {
          tags: ["System"],
          summary: "API Information",
          description: "Get general API information and available endpoints",
          operationId: "getInfo",
          responses: {
            "200": {
              description: "API information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          version: { type: "string" },
                          description: { type: "string" },
                          documentation: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Surah: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Surah number (1-114)",
              example: 1,
            },
            name: {
              type: "string",
              description: "Arabic name of Surah",
              example: "Al-Fatihah",
            },
            englishName: {
              type: "string",
              description: "English name of Surah",
              example: "The Opening",
            },
            englishNameTranslation: {
              type: "string",
              description: "English translation description",
              example: "The Key to the Qur'an",
            },
            numberOfAyahs: {
              type: "integer",
              description: "Total number of verses in Surah",
              example: 7,
            },
            revelationType: {
              type: "string",
              enum: ["Meccan", "Medinan"],
              description: "Location of revelation",
              example: "Meccan",
            },
          },
          required: [
            "id",
            "name",
            "englishName",
            "englishNameTranslation",
            "numberOfAyahs",
            "revelationType",
          ],
        },
        SurahDetail: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Al-Fatihah" },
            englishName: { type: "string", example: "The Opening" },
            englishNameTranslation: { type: "string" },
            numberOfAyahs: { type: "integer", example: 7 },
            revelationType: { type: "string", example: "Meccan" },
            ayahs: {
              type: "array",
              items: { $ref: "#/components/schemas/Ayah" },
            },
          },
          required: ["id", "name", "englishName", "numberOfAyahs", "ayahs"],
        },
        Ayah: {
          type: "object",
          properties: {
            ayahNumber: {
              type: "integer",
              description: "Global ayah number in the Quran",
              example: 1,
            },
            surahNumber: {
              type: "integer",
              description: "Surah number",
              example: 1,
            },
            ayahNumberInSurah: {
              type: "integer",
              description: "Ayah number within the Surah",
              example: 1,
            },
            text: {
              type: "string",
              description: "Arabic text of the Ayah",
              example: "الحمد لله رب العالمين",
            },
            translation: {
              type: "string",
              description: "English translation",
              example: "All praise is due to Allah alone...",
            },
          },
          required: [
            "ayahNumber",
            "surahNumber",
            "ayahNumberInSurah",
            "text",
            "translation",
          ],
        },
        SearchResult: {
          type: "object",
          properties: {
            ayahNumber: { type: "integer" },
            surahNumber: { type: "integer" },
            surahName: { type: "string" },
            ayahNumberInSurah: { type: "integer" },
            text: { type: "string" },
            translation: { type: "string" },
            relevance: {
              type: "number",
              description: "Relevance score (0-1)",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                status: { type: "integer" },
              },
            },
          },
        },
      },
      securitySchemes: {
        RateLimit: {
          type: "apiKey",
          name: "X-RateLimit-Limit",
          in: "header",
          description: "Rate limiting headers included in all responses",
        },
      },
    },
    security: [{ RateLimit: [] }],
  };
}
