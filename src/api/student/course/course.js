import request from '@/utils/request'

export function findCourseByteacherId() {
  return request({
    url: 'api/teacher/findCourseByteacherId',
    method: 'get'
  })
}

export function listajaxSection(collegeId) {
  return request({
    url: 'api/section/pageQuery',
    method: 'get',
  })
}

export function listajaxTeam() {
  return request({
    url: 'api/team/pageQuery',
    method: 'get'
  })
}

export function listajaxWeek() {
  return request({
    url: 'api/week/pageQuery',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/classes/add',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/classes/deleteCollege',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function edit(data) {
  return request({
    url: 'api/classes/editCollege',
    method: 'post',
    data
  })
}

export default { add, edit, del}
