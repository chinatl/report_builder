import { observable, action } from 'mobx';
import agent from '../agent';

class reportStore {

  @observable reportsRegistry = observable.map();

  getReport(reportId) {
    return this.reportsRegistry.get(reportId);
  }

  @action loadArticle(slug, { acceptCached = false } = {}) {
    if (acceptCached) {
      const article = this.getArticle(slug);
      if (article) return Promise.resolve(article);
    }
    this.isLoading = true;
    return agent.Articles.get(slug)
      .then(action(({ article }) => {
        this.articlesRegistry.set(article.slug, article);
        return article;
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

}

export default new ReportStore();