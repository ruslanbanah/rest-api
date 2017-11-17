import RBAC from 'rbac2'
import rules from '../../config/rbac.config'
import APIError from '../helpers/APIError'
import httpStatus from 'http-status'

class RBAC_Promise extends RBAC {
  isOk(req, rule, params){
    return new Promise((resolved, reject)=>{
      this.check(req.authUser.role, rule, params, (err, result)=>{
        if(!result) reject(new APIError('FORBIDDEN', httpStatus.FORBIDDEN, true))
        resolved()
      })
    })
  }
}

let rbac = new RBAC_Promise(rules)

export default { rbac }
