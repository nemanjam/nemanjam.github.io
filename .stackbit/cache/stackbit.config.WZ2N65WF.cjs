"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// stackbit.config.ts
var stackbit_config_exports = {};
__export(stackbit_config_exports, {
  default: () => stackbit_config_default
});
module.exports = __toCommonJS(stackbit_config_exports);
var import_types = require("@stackbit/types");
var import_cms_git = require("@stackbit/cms-git");
var stackbit_config_default = (0, import_types.defineStackbitConfig)({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",
  devCommand: "node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1",
  experimental: {
    ssg: {
      name: "Astro",
      logPatterns: {
        up: ["is ready", "astro"]
      },
      directRoutes: {
        "socket.io": "socket.io"
      },
      passthrough: ["/vite-hmr/**"]
    }
  },
  contentSources: [
    new import_cms_git.GitContentSource({
      rootPath: "/Users/wyh/\u5F00\u53D1/\u6211\u7684\u535A\u5BA2/blog",
      contentDirs: ["src/content/post", "src/content/project"],
      models: [
        // Post content model
        {
          name: "post",
          type: "page",
          urlPath: "/blog/{slug}",
          filePath: "src/content/post/{year}/{slug}/index.mdx",
          fields: [
            {
              name: "title",
              type: "string",
              required: true,
              default: "New Post"
            },
            {
              name: "description",
              type: "text",
              required: false,
              default: "Post description"
            },
            {
              name: "publishDate",
              type: "date",
              required: true
            },
            {
              name: "updatedDate",
              type: "date",
              required: false
            },
            {
              name: "heroImage",
              type: "image",
              required: false
            },
            {
              name: "heroAlt",
              type: "string",
              required: false,
              default: "Hero image"
            },
            {
              name: "noHero",
              type: "boolean",
              required: false,
              default: false
            },
            {
              name: "toc",
              type: "boolean",
              required: false,
              default: true,
              label: "Table of Contents"
            },
            {
              name: "draft",
              type: "boolean",
              required: false,
              default: false
            },
            {
              name: "category",
              type: "enum",
              required: false,
              default: "tutorials",
              options: [
                "tutorials",
                "homelab",
                "tips-and-tricks",
                "news",
                "showcases",
                "video",
                "tools",
                "resources"
              ]
            },
            {
              name: "tags",
              type: "list",
              required: true,
              items: {
                type: "enum",
                options: [
                  "next.js",
                  "react",
                  "astro",
                  "node.js",
                  "javascript",
                  "css",
                  "python",
                  "devops",
                  "docker",
                  "self-hosting",
                  "algorithms",
                  "computer-science"
                ]
              }
            }
          ]
        },
        // Project content model
        {
          name: "project",
          type: "page",
          urlPath: "/projects/{slug}",
          filePath: "src/content/project/{year}/{slug}/index.mdx",
          fields: [
            {
              name: "title",
              type: "string",
              required: true,
              default: "New Project"
            },
            {
              name: "description",
              type: "text",
              required: false,
              default: "Project description"
            },
            {
              name: "publishDate",
              type: "date",
              required: true
            },
            {
              name: "updatedDate",
              type: "date",
              required: false
            },
            {
              name: "heroImage",
              type: "image",
              required: false
            },
            {
              name: "heroAlt",
              type: "string",
              required: false,
              default: "Hero image"
            },
            {
              name: "draft",
              type: "boolean",
              required: false,
              default: false
            }
          ]
        }
      ],
      assetsConfig: {
        referenceType: "static",
        staticDir: "src/content",
        uploadDir: "_images",
        publicPath: "/src/content/"
      }
    })
  ]
});
//# sourceMappingURL=stackbit.config.WZ2N65WF.cjs.map
