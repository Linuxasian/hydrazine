import client from '../src/client'
export default function main(str: string = '', extendedLibrary: any = {}) {
  const start = new Date().getTime()

  const date = new Date()
  const library = {
    DATE_LOCASETIMESTRING: date.toLocaleTimeString(),
    DATE_TIMESTRING: date.toTimeString(),
    DATE_LOCALEDATESTRING: date.toLocaleDateString(),
    DATE_DATESTRING: date.toDateString(),
    PROCESS_UPTIME: start - date.getTime(),
    BOTNAME: client?.user?.tag,
    PROCESS_ID: process.pid,
  }

  Object.keys(extendedLibrary).forEach((key) => {
    const value = extendedLibrary[key]
    library[key] = value
  })

  let m = Object.keys(library)
  let final: string = str

  for (let i = 0; i < m.length; i++) {
    const key = m[i]
    const val = library[key]
    if (val && key) {
      final = final.replace(`$${key}`, val)
    }
  }

  return final
}
