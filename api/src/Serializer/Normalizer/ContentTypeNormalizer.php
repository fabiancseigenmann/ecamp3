<?php

namespace App\Serializer\Normalizer;

use ApiPlatform\Api\IriConverterInterface;
use App\Entity\ContentType;
use App\Metadata\Resource\Factory\UriTemplateFactory;
use Rize\UriTemplate;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerAwareInterface;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * Adds API link to contentNodes for ContentType based on the defined 'entityClass'.
 */
class ContentTypeNormalizer implements NormalizerInterface, SerializerAwareInterface {
    public function __construct(
        private NormalizerInterface $decorated,
        private UriTemplate $uriTemplate,
        private UriTemplateFactory $uriTemplateFactory,
        private IriConverterInterface $iriConverter,
    ) {}

    public function supportsNormalization($data, $format = null, array $context = []): bool {
        return $this->decorated->supportsNormalization($data, $format, $context);
    }

    public function normalize($object, $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null {
        $data = $this->decorated->normalize($object, $format, $context);

        if ($object instanceof ContentType && isset($object->entityClass)) {
            // get uri for the respective ContentNode entity and add ContentType as query parameter
            [$uriTemplate, $templated] = $this->uriTemplateFactory->createFromResourceClass($object->entityClass);
            $uri = $this->uriTemplate->expand($uriTemplate, ['contentType' => $this->iriConverter->getIriFromResource($object)]);

            // add uri as HAL link
            $data['_links']['contentNodes']['href'] = $uri;

            // unset the property itself (property definition was only needed to ensure proper API documentation)
            unset($data['contentNodes']);
        }

        return $data;
    }

    public function getSupportedTypes(?string $format): array {
        if (method_exists($this->decorated, 'getSupportedTypes')) {
            return $this->decorated->getSupportedTypes($format);
        }

        return ['*' => false];
    }

    public function setSerializer(SerializerInterface $serializer): void {
        if ($this->decorated instanceof SerializerAwareInterface) {
            $this->decorated->setSerializer($serializer);
        }
    }
}
