import _ from 'lodash/fp';
import React, { Component, ComponentType, Fragment, SFC } from 'react';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

import { Project, Table } from 'src/client/components';
import { ICryptoAsset, ViewName, ViewType } from 'src/client/interfaces';
import { connect } from 'src/client/store';
import { CoinsActionCreators, ICoinsState } from 'src/client/store/coins';
import { compose } from 'src/client/utils';

type CoinsProps = ICoinsState & CoinsActionCreators & RouteComponentProps<{}>;

export class Coins extends Component<CoinsProps> {
  static toExactPath = () => <Redirect to="/coins" />;

  async componentDidMount() {
    this.props.loadAllCoins();
  }

  goToProjectView = (event, project: ICryptoAsset) => {
    const coinId = _.kebabCase(project.name); // TODO: formalize

    this.props.history.push(`/coins/${coinId}`, {
      view: {
        name: ViewName.Coins,
        type: ViewType.Project,
        config: {
          data: project
        }
      }
    });
  }

  Loading: SFC = () => (
    <div style={styles.loading}>
      <CircularProgress size={100} />
    </div>
  )

  ProjectView: SFC = () => {
    const { state } = this.props.location;

    if (_.isEmpty(this.props.location.state)) return Coins.toExactPath();

    const coin: ICryptoAsset = state.view.config.data;

    return coin && (
      <Project
        {...coin}
        website={coin.officialWebsite}
      />
    );
  }

  TableView: SFC = () => (
    <Table
      data={this.props.all}
      loading={this.props.loading}
      onRowClick={this.goToProjectView}
    />
  )

  render() {
    const { Loading, ProjectView, TableView } = this;
    const { loading, match } = this.props;

    return loading ? <Loading /> : (
      <Fragment>
        <Route exact={true} path={match.path} component={TableView} />
        <Route path={`${match.path}/:coinId`} component={ProjectView} />
      </Fragment>
    );
  }
}

const styles = {
  loading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default compose(
  connect(
    // TODO: move to `coins` path
    store => store.coins,
    actions => actions.coins
  ),
  withRouter
)(Coins) as ComponentType & Pick<typeof Coins, 'toExactPath'>;
