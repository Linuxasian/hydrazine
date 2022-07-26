import sqlite3 from 'sqlite3'
import formatMessage from '../module/formatMessage'

const db = new sqlite3.Database(
  process.env.DATABASE_PATH || `../database/main.db`,
)

export default function main(
  action: any,
  options: { extendedLibrary?: any } = {},
) {
  switch (action.$type) {
    case 'console_log': {
      console.log(formatMessage(action.$value, options.extendedLibrary))
      break
    }
    case 'console_warn': {
      console.warn(formatMessage(action.$value, options.extendedLibrary))
      break
    }
    case 'run_sqlite_query': {
      db.serialize(() => {
        db.run(action.$value, (err: any, result: any) => {
          if (action.$callbacks) {
            action.$callbacks.forEach((callback: any) => {
              if (callback) {
                if (callback.$actions) {
                  callback.$actions.forEach((action: any) => {
                    main(action, {
                      extendedLibrary: {
                        ERROR: err,
                        RESULT: JSON.stringify(result),
                      },
                    })
                  })
                }
              }
            })
          }
        })
      })
      break
    }
    case 'get_sqlite_query': {
      db.serialize(() => {
        db.get(action.$value, (err: any, result: any) => {
          if (action.$callbacks) {
            action.$callbacks.forEach((callback: any) => {
              if (callback) {
                if (callback.$actions) {
                  callback.$actions.forEach((action: any) => {
                    main(action, {
                      extendedLibrary: {
                        ERROR: err,
                        RESULT: JSON.stringify(result),
                      },
                    })
                  })
                }
              }
            })
          }
        })
      })
      break
    }
  }
}
