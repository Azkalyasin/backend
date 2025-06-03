import React from "react";

const DocumentationPage = () => {
  const endpoints = [
    {
      method: "GET",
      path: "/api/pokemon",
      description: "Get all pokemon",
      response: '[ { "_id": string, "name": string, "type": string[], "abilities": string[], "image": string } ]',
    },
    {
      method: "GET",
      path: "/api/pokemon/:id",
      description: "Get a specific pokemon by ID",
      response: '{ "_id": string, "name": string, "type": string[], "abilities": string[], "image": string }',
    },
    {
      method: "POST",
      path: "/api/pokemon",
      description: "Create a new pokemon",
      body: '{ "name": string, "type": string[], "abilities": string[], "image": string }',
      response: '{ "_id": string, "name": string, "type": string[], "abilities": string[], "image": string }',
    },
    {
      method: "PUT",
      path: "/api/pokemon/:id",
      description: "Update a pokemon",
      body: '{ "name": string, "type": string[], "abilities": string[], "image": string }',
      response: '{ "_id": string, "name": string, "type": string[], "abilities": string[], "image": string }',
    },
    {
      method: "DELETE",
      path: "/api/pokemon/:id",
      description: "Delete a pokemon",
      response: '{ "message": "Pokemon deleted successfully" }',
    },
    {
      method: "GET",
      path: "/api/pokemon/search?q=query",
      description: "Search pokemon by name",
      response: '[ { "_id": string, "name": string, "type": string[], "abilities": string[], "image": string } ]',
    },
    {
      method: "GET",
      path: "/api/pokemon/filter/type?q=type",
      description: "Filter pokemon by type",
      response: '[ { "_id": string, "name": string, "type": string[], "abilities": string[], "image": string } ]',
    },
        {
      method: "GET",
      path: "/api/news",
      description: "Get all news",
      response: '[ { "_id": string, "title": string, "content": string, "image": string } ]',
    },
    {
      method: "GET",
      path: "/api/news/:id",
      description: "Get a specific news by ID",
      response: '{ "_id": string, "title": string, "content": string, "image": string }',
    },
    {
      method: "POST",
      path: "/api/news",
      description: "Create a new news",
      body: '{ "title": string, "content": string, "image": string }',
      response: '{ "_id": string, "title": string, "content": string, "image": string }',
    },
    {
      method: "PUT",
      path: "/api/news/:id",
      description: "Update a news",
      body: '{ "title": string, "content": string, "image": string }',
      response: '{ "_id": string, "title": string, "content": string, "image": string }',
    },
    {
      method: "DELETE",
      path: "/api/news/:id",
      description: "Delete a news",
      response: '{ "message": "News deleted successfully" }',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      <div className="space-y-8">
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  endpoint.method === "GET" ? "bg-blue-100 text-blue-800" : endpoint.method === "POST" ? "bg-green-100 text-green-800" : endpoint.method === "PUT" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}
              >
                {endpoint.method}
              </span>
              <code className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
            </div>

            <p className="text-gray-600 mb-4">{endpoint.description}</p>

            {endpoint.body && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h3>
                <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                  <code>{endpoint.body}</code>
                </pre>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Response:</h3>
              <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                <code>{endpoint.response}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentationPage;
