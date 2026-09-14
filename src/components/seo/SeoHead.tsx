import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaObj?: any;
  noindex?: boolean;
}

export function SeoHead({ title = 'IZCOR - Soluciones Médicas', description = 'IZCOR — Plataforma corporativa con catálogo multimarca y motor autónomo de sincronización, validación y publicación continua de equipamiento e insumos médicos.', canonical, canonicalUrl, ogImage, schemaObj, noindex }: SeoHeadProps) {
  const url = canonical || canonicalUrl;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {url && <link rel="canonical" href={url} />}
      {schemaObj && (
        <script type="application/ld+json">
          {JSON.stringify(schemaObj)}
        </script>
      )}
    </Helmet>
  );
}
