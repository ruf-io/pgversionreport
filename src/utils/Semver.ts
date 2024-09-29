export default class Semver {
    major: number;
    minor: number;
    patch: number;

    constructor(version: string) {
        const split = version.split(".");
        try {
            this.major = parseInt(split[0]);
            if (isNaN(this.major)) throw 1;
        } catch {
            throw new Error("Invalid version");
        }
        try {
            this.minor = parseInt(split[1]);
            if (isNaN(this.minor)) this.minor = 0;
        } catch {
            this.minor = 0;
        }
        try {
            this.patch = parseInt(split[2]);
            if (isNaN(this.patch)) this.patch = 0;
        } catch {
            this.patch = 0;
        }
    }

    newerOrEqual(version: Semver) {
        if (this.major > version.major) {
            return true;
        }
        if (this.major === version.major) {
            if (this.minor > version.minor) {
                return true;
            }
            if (this.minor === version.minor) {
                return this.patch >= version.patch;
            }
        }
        return false;
    }
}
