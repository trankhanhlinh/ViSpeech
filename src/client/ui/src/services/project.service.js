/* eslint-disable no-underscore-dangle */
import { DEFAULT_ERR_MESSAGE, JWT_TOKEN, DEFAULT_PAGINATION } from '../utils/constant'
import STORAGE from '../utils/storage'
import Utils from '../utils'
import { apiUrl } from './api-url'
import UserService from './user.service'

export default class ProjectService {
  static createProject = ({ name, description, userId }) => {
    const api = `${apiUrl}/projects`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'POST',
      body: JSON.stringify({ name, description, userId }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.text()
      })
      .then(result => {
        const resultObj = result ? JSON.parse(result) : {}
        if (status !== 201) {
          throw new Error(resultObj.message || DEFAULT_ERR_MESSAGE)
        }
        return resultObj
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static getProjectList = filterConditions => {
    const { pagination, sortField, sortOrder, filters } = filterConditions
    const { current, pageSize } = pagination
    const offset = (current - 1) * pageSize || 0
    const limit = pageSize || 0

    let query = `${Utils.parameterizeObject({ offset, limit })}`
    query += Utils.buildSortQuery(sortField, sortOrder)
    query += Utils.buildFiltersQuery(filters)
    query = Utils.trimByChar(query, '&')

    const api = `${apiUrl}/projects?${query}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    // eslint-disable-next-line no-undef
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static getMyProjectList = filterConditions => {
    const { userId, pagination, sortField, sortOrder, filters } = filterConditions
    const { current, pageSize } = pagination || DEFAULT_PAGINATION.SIZE_100
    const offset = (current - 1) * pageSize || 0
    const limit = pageSize || 0

    let query = `${Utils.parameterizeObject({ userId, offset, limit })}`
    query += Utils.buildSortQuery(sortField, sortOrder)
    query += Utils.buildFiltersQuery(filters)
    query = Utils.trimByChar(query, '&')

    const api = `${apiUrl}/projects/user-projects?${query}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    // eslint-disable-next-line no-undef
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static getAcceptedProjectList = filterConditions => {
    const { userId, pagination, sortField, sortOrder, filters } = filterConditions
    const { current, pageSize } = pagination
    const offset = (current - 1) * pageSize || 0
    const limit = pageSize || 0

    let query = `${Utils.parameterizeObject({ userId, offset, limit })}`
    query += Utils.buildSortQuery(sortField, sortOrder)
    query += Utils.buildFiltersQuery(filters)
    query = Utils.trimByChar(query, '&')

    const api = `${apiUrl}/projects/accepted-projects?${query}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    // eslint-disable-next-line no-undef
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static getProjectNameList = filterConditions => {
    const { pagination, sortField, sortOrder, filters } = filterConditions
    const { current, pageSize } = pagination || DEFAULT_PAGINATION.SIZE_100
    const offset = (current - 1) * pageSize || 0
    const limit = pageSize || 0

    let query = `${Utils.parameterizeObject({ offset, limit })}`
    query += Utils.buildSortQuery(sortField, sortOrder)
    query += Utils.buildFiltersQuery(filters)
    query = Utils.trimByChar(query, '&')

    const api = `${apiUrl}/projects/names?${query}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(DEFAULT_ERR_MESSAGE)
        }
        return result
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static getProjectInfo = async id => {
    const api = `${apiUrl}/projects/${id}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)
    const assignees = await UserService.getProjectAssignees(id)

    let status = 400
    return fetch(api, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.json()
      })
      .then(result => {
        if (status !== 200) {
          throw new Error(DEFAULT_ERR_MESSAGE)
        }
        // eslint-disable-next-line no-param-reassign
        result.assignees = assignees || []
        return result
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static updateProjectInfo = (id, info) => {
    const api = `${apiUrl}/projects/${id}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'PUT',
      body: JSON.stringify({
        ...info,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.text()
      })
      .then(result => {
        const resultObj = result ? JSON.parse(result) : {}
        if (status !== 200) {
          throw new Error(resultObj.message || DEFAULT_ERR_MESSAGE)
        }
        return resultObj
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }

  static deleteProject = id => {
    const api = `${apiUrl}/projects/${id}`
    const jwtToken = STORAGE.getPreferences(JWT_TOKEN)

    let status = 400
    return fetch(api, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        status = response.status
        return response.text()
      })
      .then(result => {
        const resultObj = result ? JSON.parse(result) : {}
        if (status !== 200) {
          throw new Error(resultObj.message || DEFAULT_ERR_MESSAGE)
        }
        return resultObj
      })
      .catch(err => {
        console.log(err.message)
        throw new Error(DEFAULT_ERR_MESSAGE)
      })
  }
}
