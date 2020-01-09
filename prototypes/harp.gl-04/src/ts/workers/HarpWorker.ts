declare let self: Worker & {
    importScripts(..._scripts: string[]): void;
};

self.importScripts("three.min.js");

import { OmvTileDecoderService, OmvTilerService } from "@here/harp-omv-datasource/index-worker";

OmvTileDecoderService.start();
OmvTilerService.start();
