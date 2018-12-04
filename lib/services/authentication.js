const sql = require('./sql')
const rq = require('request')
const ENTITY = 'app_auth'
const logger = require('console-files')

module.exports = {
  getAppInfor: async (app, sotreId) => {
    let find = await sql.select({ application_app_id: app.application.app_id }, ENTITY).catch(e => logger.log(e))
    let params = {
      application_id: app.application._id,
      application_app_id: app.application.app_id,
      application_title: app.application.title,
      authentication_id: app.authentication._id,
      authentication_permission: JSON.stringify(app.authentication.permissions),
      store_id: sotreId
    }
    if (!find) {
      sql.insert(params, ENTITY).then(r => {
        this.getAppToken(app)
      }).catch(e => logger.log(e))
    } else {
      let where = { application_app_id: app.application.app_id }
      sql.update(params, where, ENTITY).then(r => {
        this.getAppToken(app)
      }).catch(e => logger.log(e))
    }
  },
  getAppToken: (app, storeId) => {
    return rq.post({
      method: 'POST',
      uri: 'https://api.e-com.plus/v1/_callback.json',
      headers: {
        'Content-Type': 'application/json',
        'X-Store-ID': storeId
      },
      body: { '_id': app.authentication._id },
      json: true
    })
  },
  setAppToken: (app, storeId) => {
    try {
      sql.update({ app_token: app.access_token }, { store_id: storeId, authentication_id: app.my_id }, ENTITY).then(r => {
        logger.log('Update Token')
      }).catch(e => logger.log(e))
    } catch (e) {
      return logger.log(e)
    }
  },
  updateRefreshToken: () => {
    let query = 'SELECT authentication_id, store_id FROM ' + ENTITY + ' WHERE updated_at < datetime("now", "-8 hours")'
    sql.each(query, (err, row) => {
      if (!err) {
        try {
          let app = {
            authentication: {
              id: row.authentication_id
            },
            store_id: row.store_id
          }
          this.getAppToken(app)
        } catch (error) {
          logger.log(new Error('Erro with auth request.', error))
        }
      }
    })
  }
}