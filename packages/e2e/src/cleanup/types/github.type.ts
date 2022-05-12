export interface Asset {
  id: number
  url: string
  node_id: string
  name: string
  size: number
  browser_download_url: string
}

export interface Release {
  id: number
  url: string
  tag_name: string
  assets: Asset[]
}

export interface ManifestRelease {
  version: string
  platform: string
  target: string
  options: string
  files: {
    image: string
    tar: string
  }
}

export interface Manifest {
  releases: ManifestRelease[]
}
