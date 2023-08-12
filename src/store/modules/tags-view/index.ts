import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import TagsViewStateTypes, { TagView } from './interface'

const tagsViewModule: Module<TagsViewStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    addVisitedView(state, { view, type }) {
      if (type === 'unshift') {
        state.visitedViews.unshift(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
          })
        )
      } else if (type === 'push') {
        state.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
          })
        )
      }
    },
    addCachedView(state, viewname: string) {
      state.cachedViews.push(viewname)
    },
    delVisitedView(state, index: number) {
      state.visitedViews.splice(index, 1)
    },
    delCachedView(state, index: number) {
      state.cachedViews.splice(index, 1)
    },
    //是否引用赋值???
    delOtherVisitedViews(state, view: TagView) {
      let cur = state.visitedViews
      cur = cur.filter((v) => {
        return v.meta?.affix || v.path === view.path
      })
    },
    delOtherCachedViews(state, index: number) {
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1)
      } else {
        state.cachedViews = []
      }
    },
    delLeftViews(state, curindex: number) {
      state.visitedViews = state.visitedViews.filter((item, index) => {
        //affix:true 固定tag, 例如'首页'
        if (index >= curindex || (item.meta && item.meta.affix)) {
          return true
        }
        //删除对应的cachedView
        const cacheIndex = state.cachedViews.indexOf(item.name as string)
        if (cacheIndex > -1) {
          state.cachedViews.splice(cacheIndex, 1)
        }
        return false
      })
    },
    delRightViews(state, curIndex: number) {
      state.visitedViews = state.visitedViews.filter((item, index) => {
        //affix:true 固定tag, 例如'首页'
        if (index <= curIndex || (item.meta && item.meta.affix)) {
          return true
        }
        const cacheIndex = state.cachedViews.indexOf(item.name as string)
        if (cacheIndex > -1) {
          state.cachedViews.splice(cacheIndex, 1)
        }
        return false
      })
    }
  },
  actions: {
    addVisitedView({ state, commit }, view: TagView) {
      if (state.visitedViews.some((v) => v.path === view.path)) return
      if (view.meta && view.meta.affix) {
        commit('addVisitedView', { view: view, type: 'unshift' })
      } else {
        commit('addVisitedView', { view: view, type: 'push' })
      }
    },
    addCachedView({ state, commit }, view: TagView) {
      const viewname = view.name as string
      if (state.cachedViews.includes(viewname)) return
      if (view.meta?.keepAlive) {
        commit('addCachedView', viewname)
      }
    },
    delVisitedView({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        for (const [i, v] of state.visitedViews.entries()) {
          if (v.path === view.path) {
            commit('delVisitedView', i)
            break
          }
        }
        resolve([...state.visitedViews])
      })
    },
    delCachedView({ state, commit }, view: TagView) {
      const viewname = view.name as string
      return new Promise((resolve) => {
        const index = state.cachedViews.indexOf(viewname)
        index > -1 && commit('delCachedView', index)
        resolve([...state.cachedViews])
      })
    },
    delOtherVisitedViews({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        commit('delOtherVisitedViews', view)
        resolve([...state.visitedViews])
      })
    },
    delOtherCachedViews({ state, commit }, view: TagView) {
      const viewname = view.name as string
      return new Promise((resolve) => {
        const index = state.cachedViews.indexOf(viewname)
        commit('delOtherCachedViews', index)
        resolve([...state.cachedViews])
      })
    },
    updateVisitedView({ state }, view: TagView) {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    addView({ dispatch }, view: TagView) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    delView({ state, dispatch }, view: TagView) {
      return new Promise((resolve) => {
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOtherViews({ state, dispatch }, view: TagView) {
      return new Promise((resolve) => {
        dispatch('delOtherVisitedViews', view)
        dispatch('delOtherCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delLeftViews({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        const curIndex = state.visitedViews.findIndex(
          (v) => v.path === view.path
        )
        if (curIndex === -1) {
          return
        }
        commit('delLeftViews', curIndex)
        resolve({
          visitedViews: [...state.visitedViews]
        })
      })
    },
    delRightViews({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        const curIndex = state.visitedViews.findIndex(
          (v) => v.path === view.path
        )
        if (curIndex === -1) {
          return
        }
        commit('delRightViews', curIndex)
        resolve({
          visitedViews: [...state.visitedViews]
        })
      })
    },
    delAllViews({ state }) {
      return new Promise((resolve) => {
        const affixTags = state.visitedViews.filter((tag) => tag.meta?.affix)
        state.visitedViews = affixTags
        state.cachedViews = []
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delAllVisitedViews({ state }) {
      return new Promise((resolve) => {
        const affixTags = state.visitedViews.filter((tag) => tag.meta?.affix)
        state.visitedViews = affixTags
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews({ state }) {
      return new Promise((resolve) => {
        state.cachedViews = []
        resolve([...state.cachedViews])
      })
    }
  }
}

export default tagsViewModule

