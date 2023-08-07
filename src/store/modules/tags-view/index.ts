import { Module } from 'vuex'
import RootStateTypes from '@/store/interface'
import TagsViewStateTypes, { TagView } from './interface'

const tagsViewModule: Module<TagsViewStateTypes, RootStateTypes> = {
  namespaced: process.env.NODE_ENV !== 'production',
  state: {
    visitedViews: ref([]),
    cachedViews: ref([])
  },
  mutations: {
    addVisitedView(state, { view, type }) {
      if (type === 'unshift') {
        state.visitedViews.value.unshift(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
          })
        )
      } else if (type === 'push') {
        state.visitedViews.value.push(
          Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
          })
        )
      }
    },
    addCachedView(state, viewname: string) {
      state.cachedViews.value.push(viewname)
    },
    delVisitedView(state, index: number) {
      state.visitedViews.value.splice(index, 1)
    },
    delCachedView(state, index: number) {
      state.cachedViews.value.splice(index, 1)
    },
    //是否引用赋值???
    delOtherVisitedViews(state, view: TagView) {
      let cur = state.visitedViews.value
      cur = cur.filter((v) => {
        return v.meta?.affix || v.path === view.path
      })
    },
    delOtherCachedViews(state, index: number) {
      if (index > -1) {
        state.cachedViews.value = state.cachedViews.value.slice(
          index,
          index + 1
        )
      } else {
        state.cachedViews.value = []
      }
    },
    delLeftViews(state, curindex: number) {
      state.visitedViews.value = state.visitedViews.value.filter(
        (item, index) => {
          //affix:true 固定tag, 例如'首页'
          if (index >= curindex || (item.meta && item.meta.affix)) {
            return true
          }
          //删除对应的cachedView
          const cacheIndex = state.cachedViews.value.indexOf(
            item.name as string
          )
          if (cacheIndex > -1) {
            state.cachedViews.value.splice(cacheIndex, 1)
          }
          return false
        }
      )
    },
    delRightViews(state, curIndex: number) {
      state.visitedViews.value = state.visitedViews.value.filter(
        (item, index) => {
          //affix:true 固定tag, 例如'首页'
          if (index <= curIndex || (item.meta && item.meta.affix)) {
            return true
          }
          const cacheIndex = state.cachedViews.value.indexOf(
            item.name as string
          )
          if (cacheIndex > -1) {
            state.cachedViews.value.splice(cacheIndex, 1)
          }
          return false
        }
      )
    }
  },
  actions: {
    addVisitedView({ state, commit }, view: TagView) {
      if (state.visitedViews.value.some((v) => v.path === view.path)) return
      if (view.meta && view.meta.affix) {
        commit('addVisitedView', { view: view, type: 'unshift' })
      } else {
        commit('addVisitedView', { view: view, type: 'push' })
      }
    },
    addCachedView({ state, commit }, view: TagView) {
      const viewname = view.name as string
      if (state.cachedViews.value.includes(viewname)) return
      if (view.meta?.keepAlive) {
        commit('addCacheView', viewname)
      }
    },
    delVisitedView({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        for (const [i, v] of state.visitedViews.value.entries()) {
          if (v.path === view.path) {
            commit('delVisitedView', i)
            break
          }
        }
        resolve([...state.visitedViews.value])
      })
    },
    delCachedView({ state, commit }, view: TagView) {
      const viewname = view.name as string
      return new Promise((resolve) => {
        const index = state.cachedViews.value.indexOf(viewname)
        index > -1 && commit('delCachedView', index)
        resolve([...state.cachedViews.value])
      })
    },
    delOtherVisitedViews({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        commit('delOtherVisitedViews', view)
        resolve([...state.visitedViews.value])
      })
    },
    delOtherCachedViews({ state, commit }, view: TagView) {
      const viewname = view.name as string
      return new Promise((resolve) => {
        const index = state.cachedViews.value.indexOf(viewname)
        commit('delOtherCachedViews', index)
        resolve([...state.cachedViews.value])
      })
    },
    updateVisitedView({ state }, view: TagView) {
      for (let v of state.visitedViews.value) {
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
          visitedViews: [...state.visitedViews.value],
          cachedViews: [...state.cachedViews.value]
        })
      })
    },
    delOtherViews({ state, dispatch }, view: TagView) {
      return new Promise((resolve) => {
        dispatch('delOtherVisitedViews', view)
        dispatch('delOtherCachedViews', view)
        resolve({
          visitedViews: [...state.visitedViews.value],
          cachedViews: [...state.cachedViews.value]
        })
      })
    },
    delLeftViews({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        const curIndex = state.visitedViews.value.findIndex(
          (v) => v.path === view.path
        )
        if (curIndex === -1) {
          return
        }
        commit('delLeftViews', curIndex)
        resolve({
          visitedViews: [...state.visitedViews.value]
        })
      })
    },
    delRightViews({ state, commit }, view: TagView) {
      return new Promise((resolve) => {
        const curIndex = state.visitedViews.value.findIndex(
          (v) => v.path === view.path
        )
        if (curIndex === -1) {
          return
        }
        commit('delRightViews', curIndex)
        resolve({
          visitedViews: [...state.visitedViews.value]
        })
      })
    },
    delAllViews({ state }) {
      return new Promise((resolve) => {
        const affixTags = state.visitedViews.value.filter(
          (tag) => tag.meta?.affix
        )
        state.visitedViews.value = affixTags
        state.cachedViews.value = []
        resolve({
          visitedViews: [...state.visitedViews.value],
          cachedViews: [...state.cachedViews.value]
        })
      })
    },
    delAllVisitedViews({ state }) {
      return new Promise((resolve) => {
        const affixTags = state.visitedViews.value.filter(
          (tag) => tag.meta?.affix
        )
        state.visitedViews.value = affixTags
        resolve([...state.visitedViews.value])
      })
    },
    delAllCachedViews({ state }) {
      return new Promise((resolve) => {
        state.cachedViews.value = []
        resolve([...state.cachedViews.value])
      })
    }
  }
}

export default tagsViewModule

