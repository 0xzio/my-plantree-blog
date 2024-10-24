import { GOOGLE_DRIVE_FOLDER_PREFIX } from './constants'
import { GoogleDrive } from './google-drive'
import { api } from './trpc'

export async function uploadToGoogleDrive(fileHash: string, file: File) {
  const token = await api.google.googleDriveToken.query()
  const drive = new GoogleDrive(token?.access_token!)

  const baseFolderId = await drive.getOrCreateFolder(
    GOOGLE_DRIVE_FOLDER_PREFIX + '-assets',
  )

  let files = await drive.searchFilesByPath(baseFolderId, fileHash)
  if (!files.length) {
    await drive.createFile(fileHash, file, baseFolderId)
  }
}
