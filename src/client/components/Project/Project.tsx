import _ from 'lodash/fp';
import React, { CSSProperties } from 'react';
import Typography from '@material-ui/core/Typography';

import { CurrencyCode, INormalizedCoinMarketCapCoin, IAirtableAttachment, ProjectName } from 'src/client/interfaces';

interface IProjectProps extends INormalizedCoinMarketCapCoin {
  name: ProjectName;
  logo?: string;
  category?: string;
  website?: string;
  premise?: string;
  symbol: CurrencyCode;
  type: string;
  whitepapers?: IAirtableAttachment[];
}

export default class Project extends React.Component<IProjectProps> {
  render() {
    console.log(this.props);
    const { name, logo, category, website, premise, symbol, type, whitepapers, price } = this.props;

    return (
      <div style={styles.grid}>
        {logo && <img src={logo} style={styles.logo} />}

        <section>
          <Typography gutterBottom={true} variant="display2">
            {name}
          </Typography>

          <Typography gutterBottom={true} variant="subheading">
            {category}{type && ` (${type})`}
          </Typography>

          {premise}
        </section>

        <section style={styles.marketInfo}>
          <strong>{symbol}</strong>
          {price && (
            <span> &bull; ${price}</span>
          )}
        </section>

        <section style={styles.links}>
          <Typography gutterBottom={true} variant="title">
            Links
          </Typography>
          <a href={website} target="_blank">Official Website</a>
        </section>

        {whitepapers && (
          <section style={styles.resources}>
            <Typography gutterBottom={true} variant="title">
              Whitepaper{whitepapers.length > 1 && 's'}
            </Typography>

            {whitepapers.map(({ id, filename, url, thumbnails }) => (
              <a href={url} key={id} target="_blank">
                {thumbnails ? (
                  <img
                    key={id}
                    src={thumbnails.small.url}
                    alt={filename}
                    style={_.omit('url', thumbnails.small)}
                  />
                ) : filename}
              </a>
            ))}
          </section>
        )}
      </div>
    );
  }
}

const styles: Record<string, CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 200px) auto 200px',
    gridTemplateRows: 'calc(150px - 1.5em) minmax(auto, 50px) auto',
    gridGap: '1.5em',
    padding: '1.5em'
  },
  logo: {
    width: '100%',
    height: '100%',
    gridRow: '1 / span 2'
  },
  marketInfo: {
    textAlign: 'center',
    gridColumn: 1,
    gridRow: 3
  },
  links: {
    gridRow: 1,
    gridColumn: 3
  },
  resources: {
    gridColumn: 3
  }
};
