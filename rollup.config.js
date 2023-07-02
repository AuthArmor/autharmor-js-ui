import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import postcss from "rollup-plugin-postcss";
import { existsSync, rmSync } from "node:fs";
import ts from "typescript";
import requireJSON5 from "require-json5";

const pkg = requireJSON5("./package.json");

rmSync("dist", {
    force: true,
    recursive: true
});

export default defineConfig({
    input: "src/index.ts",
    output: [
        {
            file: "dist/esm/index.js",
            format: "esm"
        },
        {
            file: "dist/cjs/index.cjs",
            format: "cjs"
        },
        {
            file: "dist/global/autharmor-ui.js",
            format: "iife",
            name: "authArmorUi",
            globals: {
                "@autharmor/sdk": "authArmor"
            }
        }
    ],
    external: ["@autharmor/sdk"],
    plugins: [
        babel({
            extensions: [".js", ".ts", ".jsx", ".tsx"],
            babelHelpers: "bundled",
            presets: [
                "babel-preset-solid",
                "@babel/preset-typescript",
                ["@babel/preset-env", { bugfixes: true, targets: pkg.browserslist }]
            ]
        }),
        nodeResolve({
            extensions: [".js", ".ts", ".jsx", ".tsx"]
        }),
        commonjs(),
        image(),
        postcss({
            extract: "autharmor.css",
            modules: true
        }),
        {
            name: "ts",
            buildEnd() {
                if (existsSync("dist/types")) {
                    return;
                }

                ts.createProgram(["src/index.ts"], {
                    target: ts.ScriptTarget.ESNext,
                    module: ts.ModuleKind.ESNext,
                    moduleResolution: ts.ModuleResolutionKind.Bundler,
                    jsx: ts.JsxEmit.Preserve,
                    jsxImportSource: "solid-js",
                    allowSyntheticDefaultImports: true,
                    esModuleInterop: true,
                    rootDir: "src",
                    declarationDir: "dist/types",
                    declaration: true,
                    emitDeclarationOnly: true
                }).emit();
            }
        }
    ]
});
